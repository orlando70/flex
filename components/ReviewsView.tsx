export default function ReviewsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
        <div className="flex items-center gap-4">
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>All Reviews</option>
            <option>Published</option>
            <option>Hidden</option>
            <option>Pending</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-600">
          Select a property from the overview to manage its reviews, or use the filters above to view specific review categories.
        </p>
      </div>
    </div>
  );
}
