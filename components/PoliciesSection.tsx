import { Clock, Shield, Ban, PawPrint, PartyPopper, CircleDot } from "lucide-react";

export default function PoliciesSection() {
  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Stay Policies</h2>
      
      {/* Check-in & Check-out */}
      <div className="bg-[#F1F3EE] rounded-lg p-6 mb-4">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">Check-in & Check-out</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Check-in time</div>
            <div className="text-base font-semibold text-gray-900">3:00 PM</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Check-out time</div>
            <div className="text-base font-semibold text-gray-900">10:00 AM</div>
          </div>
        </div>
      </div>

      {/* House Rules */}
      <div className="bg-[#F1F3EE] rounded-lg p-6 mb-4">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">House Rules</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <Ban className="w-5 h-5 text-gray-700" />
            <span className="text-sm text-gray-900">No smoking</span>
          </div>
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <PawPrint className="w-5 h-5 text-gray-700" />
            <span className="text-sm text-gray-900">No pets</span>
          </div>
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <PartyPopper className="w-5 h-5 text-gray-700" />
            <span className="text-sm text-gray-900">No parties or events</span>
          </div>
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <CircleDot className="w-5 h-5 text-gray-700" />
            <span className="text-sm text-gray-900">Security deposit required</span>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-[#F1F3EE] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-base font-semibold text-gray-900">Cancellation Policy</h3>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg p-4 items-center gap-3">
            <h4 className="text-base font-semibold text-gray-900 mb-4">For stays less than 28 days</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 flex-shrink-0"></div>
                <span className="text-sm text-gray-600 leading-relaxed">Full refund up to 14 days before check-in</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 flex-shrink-0"></div>
                <span className="text-sm text-gray-600 leading-relaxed">No refund for bookings less than 14 days before check-in</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 items-center gap-3">
            <h4 className="text-base font-semibold text-gray-900 mb-4">For stays of 28 days or more</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 flex-shrink-0"></div>
                <span className="text-sm text-gray-600 leading-relaxed">Full refund up to 30 days before check-in</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full mt-2.5 flex-shrink-0"></div>
                <span className="text-sm text-gray-600 leading-relaxed">No refund for bookings less than 30 days before check-in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}