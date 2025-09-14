'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Target,
  Users,
  Globe,
  TrendingUp,
  MessageCircle,
  Video,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Camera,
  Eye,
  Play,
  ShoppingBag,
  Download,
  Store,
  Phone
} from 'lucide-react'

const STEPS = [
  { id: 'objective', title: 'Campaign Objective', description: 'What do you want to achieve?' },
  { id: 'targeting', title: 'Audience Targeting', description: 'Who is your target audience?' },
  { id: 'creative', title: 'Creative Assets', description: 'Upload your ad creatives' },
  { id: 'budget', title: 'Budget & Schedule', description: 'Set your budget and timeline' },
  { id: 'review', title: 'Review & Launch', description: 'Review your campaign settings' }
]

const OBJECTIVES = [
  {
    id: 'brand_awareness',
    title: 'Brand Awareness',
    description: 'Show your ads to people who are most likely to be interested in your brand.',
    icon: Eye,
    recommended: false,
    bgImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop&crop=faces'
  },
  {
    id: 'reach',
    title: 'Reach',
    description: 'Maximize the number of people who see your ads.',
    icon: Users,
    recommended: false,
    bgImage: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop'
  },
  {
    id: 'traffic',
    title: 'Traffic',
    description: 'Drive people to your website or app.',
    icon: Globe,
    recommended: true,
    bgImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop'
  },
  {
    id: 'engagement',
    title: 'Engagement',
    description: 'Get more people to interact with your posts or Page.',
    icon: MessageCircle,
    recommended: false,
    bgImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'
  },
  {
    id: 'app_installs',
    title: 'App Installs',
    description: 'Get more people to install your app.',
    icon: Phone,
    recommended: false,
    bgImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop'
  },
  {
    id: 'video_views',
    title: 'Video Views',
    description: 'Get more people to watch your videos.',
    icon: Video,
    recommended: false,
    bgImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=300&h=200&fit=crop'
  },
  {
    id: 'lead_generation',
    title: 'Lead Generation',
    description: 'Collect leads from people interested in your business.',
    icon: Download,
    recommended: true,
    bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
  },
  {
    id: 'sales',
    title: 'Sales',
    description: 'Find people likely to purchase your products or services.',
    icon: ShoppingBag,
    recommended: true,
    bgImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop'
  },
  {
    id: 'store_traffic',
    title: 'Store Traffic',
    description: 'Drive foot traffic to your physical stores.',
    icon: Store,
    recommended: false,
    bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop'
  }
]

export default function CampaignWizardPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    objective: '',
    campaignName: '',
    audience: '',
    budget: '',
    schedule: ''
  })

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleObjectiveSelect = (objectiveId: string) => {
    setFormData({ ...formData, objective: objectiveId })
  }

  const handleSaveTemplate = () => {
    toast.success('Campaign template saved successfully!')
  }

  const handleLaunchCampaign = () => {
    toast.success('Campaign launched successfully!')
    // Here you would typically redirect to campaign dashboard or show success message
  }

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'objective':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Choose Your Campaign Objective</h2>
              <p className="text-muted-foreground">
                Select what you want your campaign to achieve. This will optimize your ads for the best results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {OBJECTIVES.map((objective) => {
                const Icon = objective.icon
                const isSelected = formData.objective === objective.id

                return (
                  <Card
                    key={objective.id}
                    className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                      isSelected
                        ? 'ring-2 ring-primary shadow-lg scale-105 border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleObjectiveSelect(objective.id)}
                  >
                    {/* Background Image */}
                    <div
                      className="h-40 w-full bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${objective.bgImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-primary rounded-full p-1">
                          <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      {objective.recommended && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5 bg-card">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted group-hover:bg-primary group-hover:text-primary-foreground'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{objective.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {objective.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )

      case 'targeting':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Define Your Audience</h2>
              <p className="text-muted-foreground">
                Tell us who you want to reach with your campaign
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Audience Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Age Range</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Input placeholder="Min age" />
                        <Input placeholder="Max age" />
                      </div>
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <RadioGroup defaultValue="all" className="mt-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all" />
                          <Label htmlFor="all">All</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Input
                      placeholder="Enter country, city, or region"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Interests</Label>
                    <Input
                      placeholder="Enter interests separated by commas"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>AI Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Similar to your customers</p>
                        <p className="text-sm text-muted-foreground">
                          Lookalike audience based on your customer data
                        </p>
                      </div>
                      <Button size="sm" variant="outline">Apply</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Engaged with similar content</p>
                        <p className="text-sm text-muted-foreground">
                          People who engaged with similar ads
                        </p>
                      </div>
                      <Button size="sm" variant="outline">Apply</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'creative':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Upload Your Creative Assets</h2>
              <p className="text-muted-foreground">
                Add images, videos, and copy for your ads
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5" />
                    <span>Media Assets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Upload your media</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your images or videos here, or click to browse
                    </p>
                    <Button>
                      Choose Files
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports JPG, PNG, MP4. Max file size: 100MB
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ad Copy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Headline</Label>
                    <Input placeholder="Your catchy headline" className="mt-1" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input placeholder="Describe your offer" className="mt-1" />
                  </div>
                  <div>
                    <Label>Call to Action</Label>
                    <RadioGroup defaultValue="learn_more">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="learn_more" id="learn_more" />
                        <Label htmlFor="learn_more">Learn More</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shop_now" id="shop_now" />
                        <Label htmlFor="shop_now">Shop Now</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sign_up" id="sign_up" />
                        <Label htmlFor="sign_up">Sign Up</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'budget':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Set Your Budget & Schedule</h2>
              <p className="text-muted-foreground">
                Define how much you want to spend and when to run your campaign
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup defaultValue="daily">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">Daily Budget</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lifetime" id="lifetime" />
                      <Label htmlFor="lifetime">Lifetime Budget</Label>
                    </div>
                  </RadioGroup>

                  <div>
                    <Label>Amount ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Budget Recommendation</p>
                    <p className="text-sm text-muted-foreground">
                      Based on your objective and audience size, we recommend a daily budget of $50-100 for optimal results.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label>End Date (Optional)</Label>
                    <Input type="date" className="mt-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Review & Launch</h2>
              <p className="text-muted-foreground">
                Review your campaign settings before launching
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Objective</p>
                      <p className="font-medium">
                        {OBJECTIVES.find(obj => obj.id === formData.objective)?.title || 'Not selected'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Budget Type</p>
                      <p className="font-medium">Daily Budget</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Target Audience</p>
                      <p className="font-medium">18-65, All Genders</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estimated Reach</p>
                      <p className="font-medium">2.3M - 2.7M people</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary rounded-full">
                    <Zap className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">Ready to Launch!</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Your campaign is configured and ready to go. Click launch to start reaching your audience.
                </p>
                <Button size="lg" className="w-full">
                  Launch Campaign
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Campaign Wizard</h1>
              <p className="text-muted-foreground">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
              </p>
            </div>
            <Badge variant="outline">
              {Math.round(progress)}% Complete
            </Badge>
          </div>

          <Progress value={progress} className="w-full" />

          <div className="flex items-center justify-between mt-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < STEPS.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="ml-2">
                    <p className={`text-sm font-medium ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${
                    index < currentStep ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderStepContent()}
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleSaveTemplate}
                className="hidden sm:flex"
              >
                Save as Template
              </Button>

              {currentStep === STEPS.length - 1 ? (
                <Button
                  onClick={handleLaunchCampaign}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Launch Campaign
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!formData.objective && currentStep === 0}
                  size="lg"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding to account for fixed footer */}
      <div className="h-20" />
    </div>
  )
}