interface SportSelectorProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
}

export default function SportSelector({ selectedSport, onSelectSport }: SportSelectorProps) {
  const sports = [
    { name: 'Football', value: 'Soccer' },
    { name: 'Basketball', value: 'Basketball' },
    { name: 'Tennis', value: 'Tennis' },
    { name: 'Baseball', value: 'Baseball' },
    { name: 'Hockey', value: 'Ice Hockey' },
    { name: 'American Football', value: 'American Football' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {sports.map((sport) => (
        <button
          key={sport.value}
          onClick={() => onSelectSport(sport.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            selectedSport === sport.value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
          }`}
        >
          {sport.name}
        </button>
      ))}
    </div>
  );
}
