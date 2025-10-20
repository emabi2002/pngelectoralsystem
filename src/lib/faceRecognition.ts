'use client'

import * as faceapi from '@vladmandic/face-api'

export interface FaceDescriptor {
  id: string
  descriptor: Float32Array
  confidence: number
  detectedAt: string
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface FaceMatch {
  personId: string
  distance: number
  confidence: number
  isMatch: boolean
}

class FaceRecognitionService {
  private isLoaded = false
  private readonly SIMILARITY_THRESHOLD = 0.6 // Adjust based on accuracy needs
  private readonly MIN_CONFIDENCE = 0.5

  async initialize(): Promise<void> {
    if (this.isLoaded) return

    try {
      console.log('Loading Face-API.js models...')

      // Load all required models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      ])

      this.isLoaded = true
      console.log('Face-API.js models loaded successfully')
    } catch (error) {
      console.error('Failed to load Face-API.js models:', error)
      throw new Error('Face recognition system initialization failed')
    }
  }

  async detectFace(
    imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): Promise<faceapi.WithFaceLandmarks<{detection: faceapi.FaceDetection}, faceapi.FaceLandmarks68> | null> {
    if (!this.isLoaded) {
      await this.initialize()
    }

    try {
      // Use SSD MobileNet for better accuracy
      const detection = await faceapi
        .detectSingleFace(imageElement, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()

      if (!detection) {
        console.log('No face detected in image')
        return null
      }

      if (detection.detection.score < this.MIN_CONFIDENCE) {
        console.log(`Face detection confidence too low: ${detection.detection.score}`)
        return null
      }

      return detection
    } catch (error) {
      console.error('Face detection failed:', error)
      return null
    }
  }

  async generateDescriptor(
    imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): Promise<FaceDescriptor | null> {
    if (!this.isLoaded) {
      await this.initialize()
    }

    try {
      const detection = await faceapi
        .detectSingleFace(imageElement, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!detection) {
        throw new Error('No face detected for descriptor generation')
      }

      if (detection.detection.score < this.MIN_CONFIDENCE) {
        throw new Error(`Face detection confidence too low: ${detection.detection.score}`)
      }

      const boundingBox = detection.detection.box

      return {
        id: this.generateId(),
        descriptor: detection.descriptor,
        confidence: detection.detection.score,
        detectedAt: new Date().toISOString(),
        boundingBox: {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height
        }
      }
    } catch (error) {
      console.error('Face descriptor generation failed:', error)
      return null
    }
  }

  async compareFaces(
    descriptor1: Float32Array,
    descriptor2: Float32Array
  ): Promise<number> {
    try {
      const distance = faceapi.euclideanDistance(descriptor1, descriptor2)
      return distance
    } catch (error) {
      console.error('Face comparison failed:', error)
      return 1.0 // Return max distance on error
    }
  }

  async findMatches(
    newDescriptor: Float32Array,
    existingDescriptors: FaceDescriptor[]
  ): Promise<FaceMatch[]> {
    const matches: FaceMatch[] = []

    for (const existing of existingDescriptors) {
      try {
        const distance = await this.compareFaces(newDescriptor, existing.descriptor)
        const isMatch = distance < this.SIMILARITY_THRESHOLD
        const confidence = Math.max(0, 1 - distance) // Convert distance to confidence

        matches.push({
          personId: existing.id,
          distance,
          confidence,
          isMatch
        })
      } catch (error) {
        console.error(`Failed to compare with descriptor ${existing.id}:`, error)
      }
    }

    // Sort by confidence (highest first)
    return matches.sort((a, b) => b.confidence - a.confidence)
  }

  async checkForDuplicates(
    newDescriptor: Float32Array,
    existingDescriptors: FaceDescriptor[]
  ): Promise<{
    isDuplicate: boolean
    matches: FaceMatch[]
    bestMatch?: FaceMatch
  }> {
    const matches = await this.findMatches(newDescriptor, existingDescriptors)
    const duplicates = matches.filter(match => match.isMatch)

    return {
      isDuplicate: duplicates.length > 0,
      matches,
      bestMatch: duplicates.length > 0 ? duplicates[0] : undefined
    }
  }

  async processImageForRegistration(
    imageElement: HTMLImageElement | HTMLCanvasElement
  ): Promise<{
    success: boolean
    descriptor?: FaceDescriptor
    error?: string
    qualityScore?: number
  }> {
    try {
      const detection = await this.detectFace(imageElement)

      if (!detection) {
        return {
          success: false,
          error: 'No face detected. Please ensure your face is clearly visible and well-lit.'
        }
      }

      const descriptor = await this.generateDescriptor(imageElement)

      if (!descriptor) {
        return {
          success: false,
          error: 'Failed to generate face descriptor. Please try again with better lighting.'
        }
      }

      // Calculate quality score based on detection confidence and face size
      const faceArea = descriptor.boundingBox.width * descriptor.boundingBox.height
      const imageArea = imageElement.width * imageElement.height
      const faceRatio = faceArea / imageArea

      let qualityScore = descriptor.confidence * 100

      // Adjust quality based on face size (ideal face should be 15-40% of image)
      if (faceRatio < 0.15) {
        qualityScore *= 0.7 // Face too small
      } else if (faceRatio > 0.4) {
        qualityScore *= 0.8 // Face too large
      }

      return {
        success: true,
        descriptor,
        qualityScore: Math.round(qualityScore)
      }
    } catch (error) {
      console.error('Image processing failed:', error)
      return {
        success: false,
        error: 'Face processing failed. Please try again.'
      }
    }
  }

  drawDetection(
    canvas: HTMLCanvasElement,
    detection: faceapi.WithFaceLandmarks<{detection: faceapi.FaceDetection}, faceapi.FaceLandmarks68>
  ): void {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const box = detection.detection.box
    const landmarks = detection.landmarks

    // Draw bounding box
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 2
    ctx.strokeRect(box.x, box.y, box.width, box.height)

    // Draw confidence score
    ctx.fillStyle = '#00ff00'
    ctx.font = '16px Arial'
    ctx.fillText(
      `${Math.round(detection.detection.score * 100)}%`,
      box.x,
      box.y - 5
    )

    // Draw facial landmarks (optional)
    ctx.fillStyle = '#ff0000'
    landmarks.positions.forEach(point => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  private generateId(): string {
    return `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Utility method to convert image to canvas for processing
  async imageToCanvas(imageFile: File): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0)
        resolve(canvas)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(imageFile)
    })
  }

  // Convert descriptor to base64 for storage
  descriptorToBase64(descriptor: Float32Array): string {
    const buffer = new ArrayBuffer(descriptor.length * 4)
    const view = new Float32Array(buffer)
    view.set(descriptor)
    const uint8Array = new Uint8Array(buffer)

    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }

    return btoa(binary)
  }

  // Convert base64 back to descriptor
  base64ToDescriptor(base64: string): Float32Array {
    const binary = atob(base64)
    const buffer = new ArrayBuffer(binary.length)
    const uint8Array = new Uint8Array(buffer)

    for (let i = 0; i < binary.length; i++) {
      uint8Array[i] = binary.charCodeAt(i)
    }

    return new Float32Array(buffer)
  }
}

// Export singleton instance
export const faceRecognitionService = new FaceRecognitionService()

// Export types and service
export default FaceRecognitionService
