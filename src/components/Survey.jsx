import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Survey() {
  const initialFormData = {
    constitution: '',
    area: '',
    boothNumber: '',
    satisfaction: '',
    frequency: '',
    recommendation: '',
    improvement: '',
    contact: '',
    age: '',
    feedback: ''
  }

  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const submitted = localStorage.getItem('surveySubmitted')
    if (submitted === 'true') {
      setIsSubmitted(true)
    }
  }, [])

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const questions = [
    { id: 'constitution', label: 'Constitution', type: 'input', required: true },
    { id: 'area', label: 'Area', type: 'input', required: true },
    { id: 'boothNumber', label: 'Booth Number', type: 'input', required: true },
    { id: 'satisfaction', label: 'How satisfied are you with our services?', type: 'radio', required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
    { id: 'frequency', label: 'How often do you use our services?', type: 'select', required: true, options: ['daily', 'weekly', 'monthly', 'rarely', 'first-time'], optionLabels: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'First Time'] },
    { id: 'recommendation', label: 'Would you recommend us to others?', type: 'radio', required: true, options: ['Yes', 'No', 'Maybe'] },
    { id: 'improvement', label: 'What can we improve?', type: 'input', placeholder: 'Your suggestions...' },
    { id: 'contact', label: 'Contact Number', type: 'tel', placeholder: 'Your phone number' },
    { id: 'age', label: 'Age Group', type: 'select', options: ['18-25', '26-35', '36-45', '46-55', '55+'] },
    { id: 'feedback', label: 'Additional Feedback', type: 'input', placeholder: 'Any other comments...' }
  ]

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
            const data = await response.json()
            resolve(`${data.city}, ${data.principalSubdivision}, ${data.countryName}`)
          } catch {
            resolve(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
          }
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    })
  }

  const saveToLocalStorage = (data) => {
    const existingData = JSON.parse(localStorage.getItem('surveyData') || '[]')
    existingData.push(data)
    localStorage.setItem('surveyData', JSON.stringify(existingData))
    localStorage.setItem('surveySubmitted', 'true')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = questions.filter(q => q.required).map(q => q.id)
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields')
      return
    }
    
    const currentTime = new Date().toLocaleString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    })
    
    let location
    try {
      location = await getCurrentLocation()
    } catch (error) {
      location = 'Location access denied or unavailable'
    }
    
    const submissionData = { ...formData, submittedAt: currentTime, location }
    
    saveToLocalStorage(submissionData)
    console.log('Survey Submission:', submissionData)
    setIsSubmitted(true)
  }

  const renderQuestion = (question, index) => {
    const { id, label, type, required, options, optionLabels, placeholder } = question
    const questionNumber = index + 1
    const labelText = `${questionNumber}. ${label}${required ? ' *' : ''}`

    if (type === 'input' || type === 'tel') {
      return (
        <div key={id} className="space-y-2">
          <Label htmlFor={id} className="text-base font-medium">{labelText}</Label>
          <Input
            id={id}
            type={type}
            value={formData[id]}
            onChange={(e) => handleInputChange(id, e.target.value)}
            placeholder={placeholder}
            required={required}
          />
        </div>
      )
    }

    if (type === 'radio') {
      return (
        <div key={id} className="space-y-3">
          <Label className="text-base font-medium">{labelText}</Label>
          <div className="space-y-2">
            {options.map((option) => (
              <label key={option} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={id}
                  value={option}
                  checked={formData[id] === option}
                  onChange={(e) => handleInputChange(id, e.target.value)}
                  className="text-blue-600"
                  required={required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )
    }

    if (type === 'select') {
      return (
        <div key={id} className="space-y-2">
          <Label htmlFor={id} className="text-base font-medium">{labelText}</Label>
          <Select value={formData[id]} onValueChange={(value) => handleInputChange(id, value)} required={required}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, idx) => (
                <SelectItem key={option} value={option}>
                  {optionLabels ? optionLabels[idx] : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                Thank You!
              </CardTitle>
              <CardDescription className="text-gray-600">
                Thank you for your response. Your feedback has been successfully recorded.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">V-Survey</CardTitle>
            <CardDescription className="text-lg">
              Help us improve our services by sharing your valuable feedback
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                {questions.map((question, index) => renderQuestion(question, index))}
              </div>

              <Button type="submit" className="w-full">
                Submit Survey
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}