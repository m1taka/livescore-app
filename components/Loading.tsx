export default function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
}
