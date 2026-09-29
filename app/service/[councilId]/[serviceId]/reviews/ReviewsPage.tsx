'use client';

import Link from 'next/link';
import { useState } from 'react';
import ReviewModal from '../../../../../components/ReviewModal';
import StarRating from '../../../../../components/lv/StarRating';

interface ReviewsPageProps {
  councilId: string;
  serviceId: string;
}

export default function ReviewsPage({ councilId, serviceId }: ReviewsPageProps) {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const serviceData = {
    westminster: {
      parking: {
        name: 'Parking Services',
        council: 'Westminster City Council',
        description: 'Parking permits, fines, and street parking management',
        rating: 4.2,
        totalReviews: 156,
        reviews: [
          {
            id: 1,
            rating: 5,
            title: "Excellent online system",
            comment: "The new online parking permit system is fantastic. Easy to use and quick processing. Got my permit within 24 hours.",
            author: "Sarah M.",
            date: "2024-01-15",
            helpful: 12,
            verified: true
          },
          {
            id: 2,
            rating: 4,
            title: "Good service, minor issues",
            comment: "Generally good experience with parking services. The staff are helpful when you call, but the website can be slow sometimes.",
            author: "John D.",
            date: "2024-01-10",
            helpful: 8,
            verified: true
          },
          {
            id: 3,
            rating: 3,
            title: "Average experience",
            comment: "Service was okay but took longer than expected to get my visitor permit. Phone lines were busy.",
            author: "Emma L.",
            date: "2024-01-08",
            helpful: 5,
            verified: false
          },
          {
            id: 4,
            rating: 5,
            title: "Very satisfied",
            comment: "Quick and efficient service. The parking enforcement team is professional and the appeal process is fair.",
            author: "Michael R.",
            date: "2024-01-05",
            helpful: 15,
            verified: true
          },
          {
            id: 5,
            rating: 2,
            title: "Poor communication",
            comment: "Had issues with my parking fine appeal. Poor communication and slow response times. Not happy with the service.",
            author: "Lisa K.",
            date: "2024-01-03",
            helpful: 3,
            verified: true
          }
        ]
      }
    }
  };

  const service = serviceData[councilId as keyof typeof serviceData]?.[serviceId as keyof typeof serviceData.westminster];

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    service.reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse();
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="ri-government-line text-white text-lg"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Rate Your Local Council</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors cursor-pointer">Home</Link>
              <Link href="/councils" className="text-gray-700 hover:text-blue-500 transition-colors cursor-pointer">All Councils</Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-500 transition-colors cursor-pointer">Services</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-500 transition-colors cursor-pointer">About</Link>
            </nav>
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
            >
              Submit Review
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b pt-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-500 hover:text-blue-600 cursor-pointer">Home</Link>
            <i className="ri-arrow-right-line text-gray-400"></i>
            <Link href={`/council/${councilId}`} className="text-blue-500 hover:text-blue-600 cursor-pointer">{service.council}</Link>
            <i className="ri-arrow-right-line text-gray-400"></i>
            <span className="text-gray-600">{service.name} Reviews</span>
          </div>
        </div>
      </section>

      {/* Service Header */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{service.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{service.description}</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(service.rating)} size="md" />
                  <span className="text-2xl font-bold text-slate-900">
                    {service.rating}
                  </span>
                </div>
                <span className="text-gray-600">{service.totalReviews} reviews</span>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {ratingDistribution.map((count, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 w-8">{5 - index}</span>
                    <i className="ri-star-fill text-yellow-400 text-sm"></i>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${service.totalReviews > 0 ? (count / service.totalReviews) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          {/* Filters */}
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">Filter by rating:</span>
                <select 
                  value={filterRating} 
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Write Review
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {service.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-white"></i>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">{review.author}</span>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{review.title}</h3>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                    <i className="ri-thumb-up-line"></i>
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                    <i className="ri-flag-line"></i>
                    <span>Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap">
              Load More Reviews
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <i className="ri-government-line text-white text-lg"></i>
                </div>
                <h3 className="text-xl font-bold">Rate Your Local Council</h3>
              </div>
              <p className="text-gray-400">
                Helping communities improve local government services through transparent feedback.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white cursor-pointer">Home</Link></li>
                <li><Link href="/councils" className="hover:text-white cursor-pointer">All Councils</Link></li>
                <li><Link href="/services" className="hover:text-white cursor-pointer">Services</Link></li>
                <li><Link href="/about" className="hover:text-white cursor-pointer">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white cursor-pointer">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white cursor-pointer">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white cursor-pointer">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white cursor-pointer">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-4">Get notified about new council services and updates</p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <i className="ri-twitter-fill"></i>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <i className="ri-facebook-fill"></i>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <i className="ri-mail-line"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rate Your Local Council. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
      />
    </div>
  );
}
