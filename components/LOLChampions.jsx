import React, { useState, useEffect } from 'react';

function LOLChampions() {
  const [champions, setChampions] = useState([]);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [championDetails, setChampionDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const roles = ['all', 'Assassin', 'Fighter', 'Mage', 'Marksman', 'Support', 'Tank'];

  // Fetch champions list
  const fetchChampions = async () => {
    try {
      const response = await fetch('https://ddragon.leagueoflegends.com/cdn/14.1.1/data/en_US/champion.json');
      const data = await response.json();
      const championsList = Object.values(data.data);
      setChampions(championsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching champions:', error);
      setLoading(false);
    }
  };

  // Fetch detailed champion data
  const fetchChampionDetails = async (championId) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.1.1/data/en_US/champion/${championId}.json`);
      const data = await response.json();
      setChampionDetails(data.data[championId]);
    } catch (error) {
      console.error('Error fetching champion details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchChampions();
  }, []);

  // Filter champions based on search and role
  const filteredChampions = champions.filter(champion => {
    const matchesSearch = champion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         champion.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || champion.tags.includes(selectedRole);
    return matchesSearch && matchesRole;
  });

  const handleChampionSelect = (champion) => {
    setSelectedChampion(champion);
    fetchChampionDetails(champion.id);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 3) return 'text-green-400';
    if (difficulty <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDifficultyText = (difficulty) => {
    if (difficulty <= 3) return 'Easy';
    if (difficulty <= 6) return 'Medium';
    return 'Hard';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gold-400 mx-auto"></div>
          <p className="mt-4 text-blue-200 text-xl">Summoning Champions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-purple-500 rounded-full opacity-15 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-20 w-40 h-40 bg-indigo-500 rounded-full opacity-5 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 lol-gradient bg-clip-text text-transparent">
            League of Legends
          </h1>
          <h2 className="text-2xl md:text-3xl text-gold-400 mb-2 font-semibold">
            Champion Explorer
          </h2>
          <p className="text-blue-200 text-lg">
            Discover the champions of the Rift
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search champions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gold-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gold-400 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-center text-blue-200">
            Found {filteredChampions.length} champions
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {!selectedChampion ? (
            /* Champions Grid */
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
              {filteredChampions.map((champion, index) => (
                <div
                  key={champion.id}
                  onClick={() => handleChampionSelect(champion)}
                  className="champion-card bg-gray-800 rounded-lg p-4 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-gold-400/20 animate-fade-in"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <div className="relative mb-3">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champion.image.full}`}
                      alt={champion.name}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <div className={`w-3 h-3 rounded-full ${getDifficultyColor(champion.info.difficulty)}`}></div>
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1 truncate">{champion.name}</h3>
                  <p className="text-gold-400 text-xs mb-2 truncate">{champion.title}</p>
                  <div className="flex flex-wrap gap-1">
                    {champion.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Champion Details */
            <div className="animate-slide-up">
              <button
                onClick={() => {
                  setSelectedChampion(null);
                  setChampionDetails(null);
                }}
                className="mb-6 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                ← Back to Champions
              </button>

              {loadingDetails ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gold-400 mx-auto"></div>
                  <p className="mt-4 text-blue-200 text-xl">Loading champion details...</p>
                </div>
              ) : championDetails && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Champion Info */}
                  <div className="lg:col-span-1">
                    <div className="champion-detail-card bg-gray-800 rounded-xl p-6 mb-6">
                      <div className="text-center mb-6">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championDetails.id}_0.jpg`}
                          alt={championDetails.name}
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-3xl font-bold text-white mb-2">{championDetails.name}</h2>
                        <p className="text-gold-400 text-lg mb-4">{championDetails.title}</p>
                        <div className="flex justify-center gap-2 mb-4">
                          {championDetails.tags.map(tag => (
                            <span key={tag} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">Difficulty</span>
                            <span className={getDifficultyColor(championDetails.info.difficulty)}>
                              {getDifficultyText(championDetails.info.difficulty)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${championDetails.info.difficulty <= 3 ? 'bg-green-400' : championDetails.info.difficulty <= 6 ? 'bg-yellow-400' : 'bg-red-400'}`}
                              style={{width: `${(championDetails.info.difficulty / 10) * 100}%`}}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">Attack</span>
                            <span className="text-red-400">{championDetails.info.attack}/10</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-red-400 h-2 rounded-full"
                              style={{width: `${(championDetails.info.attack / 10) * 100}%`}}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">Defense</span>
                            <span className="text-blue-400">{championDetails.info.defense}/10</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-400 h-2 rounded-full"
                              style={{width: `${(championDetails.info.defense / 10) * 100}%`}}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">Magic</span>
                            <span className="text-purple-400">{championDetails.info.magic}/10</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-purple-400 h-2 rounded-full"
                              style={{width: `${(championDetails.info.magic / 10) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Abilities and Lore */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Lore */}
                    <div className="champion-detail-card bg-gray-800 rounded-xl p-6">
                      <h3 className="text-2xl font-bold text-gold-400 mb-4">Lore</h3>
                      <p className="text-gray-300 leading-relaxed">{championDetails.lore}</p>
                    </div>

                    {/* Abilities */}
                    <div className="champion-detail-card bg-gray-800 rounded-xl p-6">
                      <h3 className="text-2xl font-bold text-gold-400 mb-6">Abilities</h3>
                      
                      {/* Passive */}
                      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-4 mb-3">
                          <img
                            src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/passive/${championDetails.passive.image.full}`}
                            alt={championDetails.passive.name}
                            className="w-12 h-12 rounded-lg"
                          />
                          <div>
                            <h4 className="text-lg font-bold text-white">Passive: {championDetails.passive.name}</h4>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{__html: championDetails.passive.description}}></p>
                      </div>

                      {/* Spells */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {championDetails.spells.map((spell, index) => (
                          <div key={spell.id} className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/spell/${spell.image.full}`}
                                alt={spell.name}
                                className="w-10 h-10 rounded-lg"
                              />
                              <div>
                                <h4 className="font-bold text-white text-sm">{['Q', 'W', 'E', 'R'][index]}: {spell.name}</h4>
                              </div>
                            </div>
                            <p className="text-gray-300 text-xs" dangerouslySetInnerHTML={{__html: spell.description}}></p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips */}
                    {(championDetails.allytips?.length > 0 || championDetails.enemytips?.length > 0) && (
                      <div className="champion-detail-card bg-gray-800 rounded-xl p-6">
                        <h3 className="text-2xl font-bold text-gold-400 mb-6">Tips</h3>
                        
                        {championDetails.allytips?.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-lg font-bold text-green-400 mb-3">Playing as {championDetails.name}</h4>
                            <ul className="space-y-2">
                              {championDetails.allytips.slice(0, 3).map((tip, index) => (
                                <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {championDetails.enemytips?.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-red-400 mb-3">Playing against {championDetails.name}</h4>
                            <ul className="space-y-2">
                              {championDetails.enemytips.slice(0, 3).map((tip, index) => (
                                <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                                  <span className="text-red-400 mt-1">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.LOLChampions = LOLChampions;