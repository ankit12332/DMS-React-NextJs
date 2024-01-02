import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchText, setSearchText, onSearch, placeholder }) => (
  <div className="flex items-center">
    <input 
      type="text"
      placeholder={placeholder || "Search..."}
      value={searchText}
      onChange={e => setSearchText(e.target.value)}
      className="border-2 border-gray-300 rounded p-1.5 mr-2"
    />
    <button 
      onClick={onSearch}
      className="bg-[#1F2937] hover:bg-opacity-90 text-white py-1.5 px-4 rounded items-center flex"
    >
      <FaSearch className="mr-2"/>
      Search
    </button>
  </div>
);

export default SearchBar;
