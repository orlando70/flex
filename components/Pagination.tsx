interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  pageSize: number;
  filteredLength: number;
}

export default function Pagination({ currentPage, setCurrentPage, totalPages, pageSize, filteredLength }: PaginationProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredLength)} of {filteredLength} properties
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
            if (page > totalPages) return null;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-500">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
