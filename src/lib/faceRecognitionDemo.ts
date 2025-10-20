'use client'

export interface FaceDescriptor {
  id: string
  descriptor: number[] // Simplified for demo
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

class DemoFaceRecognitionService {
  private isLoaded = false
  private readonly SIMILARITY_THRESHOLD = 0.6
  private readonly MIN_CONFIDENCE = 0.7

  async initialize(): Promise<void> {
    if (this.isLoaded) return

    console.log('Initializing demo face recognition system...')

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1500))

    this.isLoaded = true
    console.log('Demo face recognition system ready')
  }

  async detectFace(
    imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | string
  ): Promise<{
    success: boolean
    descriptor?: number[]
    qualityScore?: number
    error?: string
  }> {
    if (!this.isLoaded) {
      await this.initialize()
    }

    // Handle string input (base64 image data)
    if (typeof imageElement === 'string') {
      // For demo purposes, simulate processing of base64 image data
      const isValidBase64 = imageElement.startsWith('data:image/')
      if (!isValidBase64) {
        return {
          success: false,
          error: 'Invalid image format'
        }
      }

      // Simulate face detection with 85% success rate
      const randomSuccess = Math.random() > 0.15

      if (randomSuccess) {
        return {
          success: true,
          descriptor: this.generateRandomDescriptor(),
          qualityScore: 75 + Math.random() * 25 // 75-100% quality
        }
      } else {
        return {
          success: false,
          error: 'No face detected or poor quality. Please try again with better lighting.'
        }
      }
    }

    // Handle element input
    const hasValidImage = imageElement.width > 100 && imageElement.height > 100
    const randomSuccess = Math.random() > 0.15 // 85% success rate

    if (hasValidImage && randomSuccess) {
      return {
        success: true,
        descriptor: this.generateRandomDescriptor(),
        qualityScore: 75 + Math.random() * 25 // 75-100% quality
      }
    } else {
      return {
        success: false,
        error: 'No face detected or poor quality. Please try again with better lighting.'
      }
    }
  }

  private generateRandomDescriptor(): number[] {
    // Generate a random 128-dimensional descriptor (typical for face recognition)
    return Array.from({ length: 128 }, () => Math.random() * 2 - 1)
  }

  async generateDescriptor(
    imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): Promise<FaceDescriptor | null> {
    if (!this.isLoaded) {
      await this.initialize()
    }

    const hasFace = await this.detectFace(imageElement)
    if (!hasFace) {
      return null
    }

    // Generate a mock descriptor based on image characteristics
    const imageData = this.getImageCharacteristics(imageElement)
    const descriptor = this.generateMockDescriptor(imageData)

    // Simulate realistic face bounding box
    const faceWidth = Math.min(imageElement.width * 0.4, 200)
    const faceHeight = Math.min(imageElement.height * 0.5, 250)
    const faceX = (imageElement.width - faceWidth) / 2
    const faceY = (imageElement.height - faceHeight) / 2

    return {
      id: this.generateId(),
      descriptor,
      confidence: 0.8 + Math.random() * 0.15, // 80-95% confidence
      detectedAt: new Date().toISOString(),
      boundingBox: {
        x: faceX,
        y: faceY,
        width: faceWidth,
        height: faceHeight
      }
    }
  }

  async compareFaces(
    descriptor1: number[],
    descriptor2: number[]
  ): Promise<number> {
    // Simulate face comparison using euclidean distance
    if (descriptor1.length !== descriptor2.length) {
      return 1.0 // Maximum distance for different length descriptors
    }

    let sumSquaredDiffs = 0
    for (let i = 0; i < descriptor1.length; i++) {
      const diff = descriptor1[i] - descriptor2[i]
      sumSquaredDiffs += diff * diff
    }

    const distance = Math.sqrt(sumSquaredDiffs) / descriptor1.length
    return Math.min(distance, 1.0) // Normalize to 0-1 range
  }

  async findMatches(
    newDescriptor: number[],
    existingDescriptors: FaceDescriptor[]
  ): Promise<FaceMatch[]> {
    const matches: FaceMatch[] = []

    for (const existing of existingDescriptors) {
      const distance = await this.compareFaces(newDescriptor, existing.descriptor)
      const isMatch = distance < this.SIMILARITY_THRESHOLD
      const confidence = Math.max(0, 1 - distance)

      matches.push({
        personId: existing.id,
        distance,
        confidence,
        isMatch
      })
    }

    return matches.sort((a, b) => b.confidence - a.confidence)
  }

  async checkForDuplicates(
    newDescriptor: number[],
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
      const hasFace = await this.detectFace(imageElement)

      if (!hasFace) {
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

      // Calculate quality score based on image characteristics
      const qualityScore = this.calculateQualityScore(imageElement, descriptor)

      return {
        success: true,
        descriptor,
        qualityScore
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
    boundingBox: { x: number; y: number; width: number; height: number },
    confidence: number
  ): void {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw bounding box
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 3
    ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height)

    // Draw confidence score
    ctx.fillStyle = '#00ff00'
    ctx.font = '16px Arial'
    ctx.fillText(
      `${Math.round(confidence * 100)}%`,
      boundingBox.x,
      boundingBox.y - 5
    )

    // Draw corner markers for better visual feedback
    const cornerSize = 15
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 2

    // Top-left corner
    ctx.beginPath()
    ctx.moveTo(boundingBox.x, boundingBox.y + cornerSize)
    ctx.lineTo(boundingBox.x, boundingBox.y)
    ctx.lineTo(boundingBox.x + cornerSize, boundingBox.y)
    ctx.stroke()

    // Top-right corner
    ctx.beginPath()
    ctx.moveTo(boundingBox.x + boundingBox.width - cornerSize, boundingBox.y)
    ctx.lineTo(boundingBox.x + boundingBox.width, boundingBox.y)
    ctx.lineTo(boundingBox.x + boundingBox.width, boundingBox.y + cornerSize)
    ctx.stroke()

    // Bottom-left corner
    ctx.beginPath()
    ctx.moveTo(boundingBox.x, boundingBox.y + boundingBox.height - cornerSize)
    ctx.lineTo(boundingBox.x, boundingBox.y + boundingBox.height)
    ctx.lineTo(boundingBox.x + cornerSize, boundingBox.y + boundingBox.height)
    ctx.stroke()

    // Bottom-right corner
    ctx.beginPath()
    ctx.moveTo(boundingBox.x + boundingBox.width - cornerSize, boundingBox.y + boundingBox.height)
    ctx.lineTo(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height)
    ctx.lineTo(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height - cornerSize)
    ctx.stroke()
  }

  private getImageCharacteristics(element: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): {
    width: number
    height: number
    aspectRatio: number
    brightness: number
  } {
    const width = element instanceof HTMLVideoElement ? element.videoWidth || element.width : element.width
    const height = element instanceof HTMLVideoElement ? element.videoHeight || element.height : element.height

    return {
      width,
      height,
      aspectRatio: width / height,
      brightness: Math.random() * 0.3 + 0.7 // Simulate brightness 70-100%
    }
  }

  private generateMockDescriptor(imageData: { width: number; height: number; aspectRatio: number; brightness: number }): number[] {
    // Generate a 128-dimensional descriptor (similar to real face recognition)
    const descriptor: number[] = []
    const seed = imageData.width * imageData.height * imageData.aspectRatio

    for (let i = 0; i < 128; i++) {
      // Use deterministic random based on image characteristics
      const value = Math.sin(seed + i) * Math.cos(imageData.brightness + i)
      descriptor.push(value)
    }

    return descriptor
  }

  private calculateQualityScore(
    element: HTMLImageElement | HTMLCanvasElement,
    descriptor: FaceDescriptor
  ): number {
    let score = descriptor.confidence * 100

    // Adjust based on image size
    const area = element.width * element.height
    if (area < 50000) { // Small image
      score *= 0.8
    } else if (area > 2000000) { // Very large image
      score *= 0.9
    }

    // Adjust based on face size relative to image
    const faceArea = descriptor.boundingBox.width * descriptor.boundingBox.height
    const imageArea = element.width * element.height
    const faceRatio = faceArea / imageArea

    if (faceRatio < 0.1) { // Face too small
      score *= 0.7
    } else if (faceRatio > 0.5) { // Face too large
      score *= 0.8
    }

    return Math.round(Math.min(score, 98)) // Cap at 98%
  }

  private generateId(): string {
    return `demo_face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Convert descriptor to base64 for storage
  descriptorToBase64(descriptor: number[]): string {
    return btoa(JSON.stringify(descriptor))
  }

  // Convert base64 back to descriptor
  base64ToDescriptor(base64: string): number[] {
    try {
      return JSON.parse(atob(base64))
    } catch {
      return []
    }
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
}

// Export singleton instance
export const demoFaceRecognitionService = new DemoFaceRecognitionService()

export default DemoFaceRecognitionService
