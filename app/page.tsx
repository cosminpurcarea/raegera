"use client"

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-indigo-600 mb-2">RAEGERA</h1>
            <p className="text-gray-500 italic mb-6">"Finis Coronat Opus"</p>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Learn German Articles <span className="text-indigo-500">Better</span>
              <br />
              <span className="text-indigo-400">Than Natives</span>
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-lg">
              Master der, die, das with our specialized practice system. Build confidence and
              fluency through daily practice and smart repetition.
            </p>
            
            <a 
              href="/practice" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              Start Practicing Now
            </a>
          </div>
          
          {/* Practice Example Card */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-700">Practice Example</h3>
            
            <div className="mb-6">
              <p className="text-2xl font-bold text-center">Apfel</p>
              <p className="text-center text-gray-600 italic">apple</p>
            </div>
            
            <div className="flex justify-center space-x-3 mb-6">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">der</button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">die</button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">das</button>
            </div>
            
            <p className="text-center text-green-600 font-medium">Correct! It's "der Apfel"</p>
          </div>
        </div>
      </section>
      
      {/* Why it Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Why RAEGERA Works</h2>
          
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Our specialized approach has helped thousands of German learners master articles with confidence.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Stats Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-3xl font-bold text-indigo-600 mb-2">2,000+</p>
              <p className="font-semibold text-gray-800 mb-2">German Nouns</p>
              <p className="text-sm text-gray-600">Comprehensive database of German nouns with articles</p>
            </div>
            
            {/* Stats Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-3xl font-bold text-indigo-600 mb-2">85%</p>
              <p className="font-semibold text-gray-800 mb-2">Success Rate</p>
              <p className="text-sm text-gray-600">Average improvement in article accuracy after 30 days</p>
            </div>
            
            {/* Stats Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-3xl font-bold text-indigo-600 mb-2">15,000+</p>
              <p className="font-semibold text-gray-800 mb-2">Practice Sessions</p>
              <p className="text-sm text-gray-600">Completed by our users every month</p>
            </div>
            
            {/* Stats Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-3xl font-bold text-indigo-600 mb-2">92%</p>
              <p className="font-semibold text-gray-800 mb-2">User Satisfaction</p>
              <p className="text-sm text-gray-600">Users report significant improvement in confidence</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Key Features</h2>
          
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Designed specifically to help you master German noun articles through proven learning techniques.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Smart Learning Algorithm</h3>
              <p className="text-gray-600">
                Our system tracks your performance and adjusts difficulty to focus on the areas where you need the most practice.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Comprehensive Database</h3>
              <p className="text-gray-600">
                Over 2,000 common German nouns with example sentences and contextual usage to reinforce learning.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Progress Tracking</h3>
              <p className="text-gray-600">
                Visualize your progress over time with detailed analytics and see how your article recognition is improving.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">What Our Users Say</h2>
          
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Hear from students who have transformed their German learning journey with RAEGERA.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-700 font-bold">SK</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah K.</h4>
                  <p className="text-sm text-gray-600">Learning German for 2 years</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Articles were always my weak point until I found RAEGERA. After just a month of daily practice, I feel so much more confident in my German writing and speaking."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-700 font-bold">MT</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael T.</h4>
                  <p className="text-sm text-gray-600">German B2 Level</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I was making the same article mistakes over and over. RAEGERA helped me identify patterns and now I get them right almost automatically. Highly recommended!"
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-700 font-bold">AL</span>
                </div>
                <div>
                  <h4 className="font-semibold">Anna L.</h4>
                  <p className="text-sm text-gray-600">German Teacher</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I recommend RAEGERA to all my students. The focused practice on articles is exactly what most learners need, and the results speak for themselves."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Frequently Asked Questions</h2>
          
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Got questions? We've got answers.
          </p>
          
          <div className="max-w-3xl mx-auto">
            {/* FAQ Item 1 */}
            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">How much time should I practice each day?</h3>
              <p className="text-gray-600">
                Just 10-15 minutes of focused practice daily can lead to significant improvements. Consistency is more important than lengthy sessions.
              </p>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Is RAEGERA suitable for beginners?</h3>
              <p className="text-gray-600">
                Absolutely! RAEGERA is designed for German learners at all levels. Beginners can focus on common nouns, while advanced learners can challenge themselves with more obscure vocabulary.
              </p>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">How is RAEGERA different from other learning apps?</h3>
              <p className="text-gray-600">
                RAEGERA specializes exclusively in German noun articles, providing targeted practice that general language apps don't offer. Our focused approach leads to faster mastery of this challenging aspect of German.
              </p>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Do I need to create an account?</h3>
              <p className="text-gray-600">
                You can practice without an account, but creating a free account allows you to track your progress, save your statistics, and access your personalized learning path across devices.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-indigo-600 py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master German Articles?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-indigo-100">
            Join thousands of successful learners who have improved their German with RAEGERA.
          </p>
          <a 
            href="/signup" 
            className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-md font-medium hover:bg-indigo-50 transition shadow-sm"
          >
            Start Learning Now — It's Free
          </a>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">RAEGERA</h3>
              <p className="text-sm text-gray-400">
                The intelligent platform for mastering German noun articles.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/practice" className="text-sm hover:text-white transition">Practice</a></li>
                <li><a href="/repository" className="text-sm hover:text-white transition">Noun Repository</a></li>
                <li><a href="/login" className="text-sm hover:text-white transition">Login</a></li>
                <li><a href="/signup" className="text-sm hover:text-white transition">Sign Up</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/blog" className="text-sm hover:text-white transition">Blog</a></li>
                <li><a href="/faq" className="text-sm hover:text-white transition">FAQ</a></li>
                <li><a href="/about" className="text-sm hover:text-white transition">About Us</a></li>
                <li><a href="/contact" className="text-sm hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-sm hover:text-white transition">Terms of Service</a></li>
                <li><a href="/privacy" className="text-sm hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/cookies" className="text-sm hover:text-white transition">Cookie Policy</a></li>
                <li>
                  <button 
                    id="open-cookie-settings"
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                  >
                    Cookie Settings
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 mt-8 text-sm text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} RAEGERA. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Cookie Settings Modal - Initially hidden */}
      <div id="cookie-modal" className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Cookie Settings</h3>
            <button id="close-cookie-settings" className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            We use cookies to improve your experience on our website. You can choose which cookies you allow below.
          </p>
          
          <div className="space-y-4 mb-6">
            {/* Necessary Cookies */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Necessary Cookies</h4>
                <p className="text-sm text-gray-600">Required for the basic functionality of the website.</p>
              </div>
              <div className="relative flex items-center">
                <input type="checkbox" id="necessary-cookies" className="sr-only" checked disabled />
                <div className="w-11 h-6 bg-indigo-600 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-5"></div>
              </div>
            </div>
            
            {/* Analytics Cookies */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Analytics Cookies</h4>
                <p className="text-sm text-gray-600">Help us improve our website by collecting anonymous usage data.</p>
              </div>
              <div className="relative flex items-center">
                <input type="checkbox" id="analytics-cookies" className="sr-only" />
                <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
            
            {/* Marketing Cookies */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Marketing Cookies</h4>
                <p className="text-sm text-gray-600">Used to deliver personalized content and advertisements.</p>
              </div>
              <div className="relative flex items-center">
                <input type="checkbox" id="marketing-cookies" className="sr-only" />
                <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button 
              id="save-cookie-settings"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
      
      {/* Script for Cookie Settings Dialog */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const openBtn = document.getElementById('open-cookie-settings');
              const closeBtn = document.getElementById('close-cookie-settings');
              const saveBtn = document.getElementById('save-cookie-settings');
              const modal = document.getElementById('cookie-modal');
              
              // Show modal
              openBtn.addEventListener('click', function() {
                modal.classList.remove('hidden');
              });
              
              // Hide modal
              closeBtn.addEventListener('click', function() {
                modal.classList.add('hidden');
              });
              
              // Save settings and hide modal
              saveBtn.addEventListener('click', function() {
                // Get preferences
                const analytics = document.getElementById('analytics-cookies').checked;
                const marketing = document.getElementById('marketing-cookies').checked;
                
                // Save to localStorage (in real app, you'd send to backend)
                localStorage.setItem('cookiePreferences', JSON.stringify({
                  necessary: true,
                  analytics: analytics,
                  marketing: marketing
                }));
                
                // Hide modal
                modal.classList.add('hidden');
              });
              
              // Toggle switch animations
              const toggles = document.querySelectorAll('input[type="checkbox"]');
              toggles.forEach(toggle => {
                if (!toggle.disabled) {
                  toggle.addEventListener('change', function() {
                    const dot = this.parentNode.querySelector('.dot');
                    if (this.checked) {
                      dot.classList.add('translate-x-5');
                      this.parentNode.querySelector('div:not(.dot)').classList.remove('bg-gray-200');
                      this.parentNode.querySelector('div:not(.dot)').classList.add('bg-indigo-600');
                    } else {
                      dot.classList.remove('translate-x-5');
                      this.parentNode.querySelector('div:not(.dot)').classList.add('bg-gray-200');
                      this.parentNode.querySelector('div:not(.dot)').classList.remove('bg-indigo-600');
                    }
                  });
                }
              });
            });
          `
        }}
      />
    </div>
  );
}
