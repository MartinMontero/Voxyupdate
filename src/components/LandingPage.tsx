import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic2, 
  FileText, 
  Users, 
  Zap, 
  Shield, 
  Download,
  Play,
  CheckCircle,
  ArrowRight,
  Github,
  Star,
  ExternalLink,
  PlayCircle
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Multi-Format Support',
      description: 'Upload PDFs, Word docs, text files, and web URLs. Process up to 10 documents simultaneously.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'AI Personas',
      description: 'Choose from expert personas or create custom ones. Each with unique voices and personalities.'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Fast Generation',
      description: 'Generate 5-20 minute podcasts in minutes using ethical AI models like Claude and Mixtral.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Citation Tracking',
      description: 'Every claim is cited with source attribution. Export bibliographies in multiple formats.'
    }
  ];

  const whyChooseFeatures = [
    'Transform complex research into digestible audio',
    'Learn while commuting or exercising',
    'Get multiple perspectives on your documents',
    'Verify every claim with source citations',
    'Export for offline listening',
    'Fully open source and customizable'
  ];

  const personas = [
    { name: 'Dr. Sarah Chen', role: 'Subject Expert', avatar: '👩‍🏫', color: 'from-blue-500 to-blue-600' },
    { name: 'Marcus Rivera', role: 'Journalist', avatar: '📰', color: 'from-green-500 to-green-600' },
    { name: 'Alex Kim', role: 'Student', avatar: '🎓', color: 'from-purple-500 to-purple-600' },
    { name: 'Maya Patel', role: 'Storyteller', avatar: '📚', color: 'from-pink-500 to-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
              >
                <Mic2 className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Voxy
              </span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Pricing
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Transform Documents into
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Engaging Podcasts
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                AI hosts debate your PDFs, research, and notes—making complex ideas digestible. 
                Every claim cited. Perfect for learning on the go. Fully open source.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                <Button 
                  size="lg" 
                  onClick={onGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Start Creating
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowDemoModal(true)}
                  className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            {/* Demo Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16"
            >
              <div className="relative max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="ml-4 text-sm text-gray-600">Voxy - AI Podcast Generator</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Documents</h3>
                        <div className="space-y-2">
                          {['Research Paper.pdf', 'Meeting Notes.docx', 'Article.txt'].map((file, i) => (
                            <div key={i} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">AI Personas</h3>
                        <div className="space-y-2">
                          {personas.slice(0, 2).map((persona, i) => (
                            <div key={i} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                              <span className="text-lg">{persona.avatar}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{persona.name}</div>
                                <div className="text-xs text-gray-500">{persona.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Generated Podcast</h3>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Play className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">Discussion.mp3</span>
                          </div>
                          <div className="text-xs text-gray-600">14:32 • 2 speakers • Citations included</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Voxy Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Voxy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for researchers, students, and professionals who want to make complex information accessible and engaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="space-y-6">
              {whyChooseFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mic2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Experience the Future of Learning
                </h3>
                <p className="text-gray-600 mb-6">
                  Transform static documents into dynamic conversations that make learning engaging and accessible.
                </p>
                <Button onClick={onGetStarted} className="w-full">
                  Try Voxy Now
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Traditional Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personas Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Your AI Podcast Hosts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from diverse personas, each with unique expertise and speaking styles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personas.map((persona, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className={`h-20 bg-gradient-to-r ${persona.color}`} />
                  <CardContent className="p-6 -mt-10">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                      {persona.avatar}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{persona.name}</h3>
                    <p className="text-sm text-gray-600">{persona.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built on Ethical AI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fully open source with transparent, ethical AI models. No vendor lock-in, complete control over your data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Open Source</h3>
                <p className="text-gray-600 text-sm">MIT licensed, community-driven development</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
                <p className="text-gray-600 text-sm">Your documents stay private, no data mining</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ethical AI</h3>
                <p className="text-gray-600 text-sm">Claude, Mixtral, and other responsible models</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Documents?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start creating engaging podcasts from your content in minutes
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={onGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Mic2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Voxy</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Open source alternative for creating AI-powered podcast discussions from documents.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
                <li><a href="#docs" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a></li>
              </ul>
            </div>

            {/* Community Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center">
                    GitHub
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center">
                    Bluesky
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center">
                    Nostr
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Status</a></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-400 text-sm">
                © 2024 Voxy. Open source under MIT License.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <span className="text-gray-400 text-sm">
                  Built with ❤️ for the open source community
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75"
              onClick={() => setShowDemoModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Demo Video Coming Soon</h3>
                  <p className="text-gray-500">
                    We're preparing an amazing demo to show you Voxy in action!
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Voxy Demo</h3>
                    <p className="text-sm text-gray-600">See how easy it is to create AI podcasts</p>
                  </div>
                  <Button onClick={() => setShowDemoModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}