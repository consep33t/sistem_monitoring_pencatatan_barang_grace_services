const SearchInput = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0v4m0-4h4m-4 0H7m4 0v4m0-4h4m-4 0H7m4 0v4m0-4h4m-4 0H7m4 0v4m0-4h4m-4 0H7m4 0v4m0-4h4m-4 0H7m4 0v4m0-4h4m-4 0H7m4 0v4m0-4h4m-4 0H7"
          />
        </svg>
      </button>
    </div>
  );
};
