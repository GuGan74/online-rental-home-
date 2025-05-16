

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, BedDouble, Bath, DollarSign, Search, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const HomePage = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [locations, setLocations] = useState({});
  const [states, setStates] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch properties and locations on component mount using Axios
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/properties');
        const data = response.data;
        console.log('Fetched properties:', data);
        setAllProperties(data);

        // Generate locations dynamically from fetched properties
        const locationMap = {};
        data.forEach(property => {
          if (!locationMap[property.state]) {
            locationMap[property.state] = new Set();
          }
          locationMap[property.state].add(property.city);
        });

        const formattedLocations = {};
        Object.keys(locationMap).forEach(state => {
          formattedLocations[state] = Array.from(locationMap[state]);
        });

        setLocations(formattedLocations);
        setStates(Object.keys(formattedLocations));
      } catch (error) {
        console.error('Axios fetch error:', error.response ? error.response.data : error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load properties. Please try again later.",
          className: "bg-gray-800 text-white border-red-500",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Update available cities when state changes
  useEffect(() => {
    if (selectedState) {
      setAvailableCities(locations[selectedState] || []);
      setSelectedCity('');
      setFilteredProperties([]);
      setSearchAttempted(false);
    } else {
      setAvailableCities([]);
      setSelectedCity('');
      setFilteredProperties([]);
      setSearchAttempted(false);
    }
  }, [selectedState, locations]);

  const handleSearch = () => {
    if (!selectedState || !selectedCity) {
      toast({
        variant: "destructive",
        title: "Selection Missing",
        description: "Please select both State and City.",
        className: "bg-gray-800 text-white border-red-500",
      });
      return;
    }

    const propertiesInCity = allProperties.filter(
      (property) => property.state === selectedState && property.city === selectedCity
    );

    setFilteredProperties(propertiesInCity);
    setSearchAttempted(true);

    if (propertiesInCity.length === 0) {
      toast({
        variant: "default",
        title: "No Listings Found",
        description: `Sorry, we don’t have rental listings in ${selectedCity} yet. Please try another city.`,
        duration: 5000,
        className: "bg-gray-800 text-gray-200 border-purple-500",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-12 w-12 border-4 border-t-purple-500 border-gray-700 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 rounded-lg bg-gray-800/70 backdrop-blur-md shadow-xl mb-12 border border-gray-700/50"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">
          Find Your Perfect Rental
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
          Select your desired location below to start discovering your next home with Rentify.
        </p>

        {/* Location Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl mx-auto bg-gray-800/50 p-6 rounded-lg shadow-md backdrop-blur-md border border-gray-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2 text-left">
              <Label htmlFor="state-select" className="text-gray-300 font-medium">State</Label>
              <Select onValueChange={setSelectedState} value={selectedState}>
                <SelectTrigger id="state-select" className="w-full bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring focus:ring-purple-500/30">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {states.map((state) => (
                    <SelectItem key={state} value={state} className="hover:bg-gray-600">{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="city-select" className="text-gray-300 font-medium">City</Label>
              <Select
                onValueChange={setSelectedCity}
                value={selectedCity}
                disabled={!selectedState || availableCities.length === 0}
              >
                <SelectTrigger id="city-select" className="w-full bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring focus:ring-purple-500/30">
                  <SelectValue placeholder={selectedState ? "Select City" : "Select State First"} />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city} className="hover:bg-gray-600">{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg hover:from-purple-700 hover:to-purple-900 transition-opacity duration-300"
                onClick={handleSearch}
                disabled={!selectedCity}
              >
                <Search className="mr-2 h-5 w-5" /> Find Rentals
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Property Listings Section */}
      <AnimatePresence>
        {searchAttempted && (
          <motion.div
            key={selectedCity || 'initial'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProperties.length > 0 ? (
              <>
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                  Properties in {selectedCity}, {selectedState}
                </h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProperties.map((property) => (
                    <motion.div key={property.id} variants={itemVariants}>
                      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-800/70 backdrop-blur-md border border-gray-700/50">
                        <div className="relative h-48 w-full">
                          <img
                            className="absolute inset-0 w-full h-full object-cover"
                            alt={property.title}
                            src={property.imageUrl}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent"></div>
                          <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-gray-800/80 text-gray-300 text-xs px-2 py-1 rounded">
                            <MapPin className="h-3 w-3 text-purple-400" />
                            <span>{property.location}</span>
                          </div>
                        </div>
                        <CardHeader className="pt-4 pb-2">
                          <CardTitle className="text-xl font-semibold text-white">{property.title}</CardTitle>
                          <CardDescription className="text-purple-400 font-bold text-lg flex items-center pt-1">
                            <DollarSign className="h-5 w-5 mr-1" />
                            {property.price} / month
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3 text-sm text-gray-300 flex justify-start space-x-4">
                          <div className="flex items-center space-x-1">
                            <BedDouble className="h-4 w-4 text-purple-400" />
                            <span>{property.beds} Beds</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bath className="h-4 w-4 text-purple-400" />
                            <span>{property.baths} Baths</span>
                          </div>
                        </CardContent>
                        <CardFooter className="pb-4">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                            <Button asChild variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600/20 hover:text-white transition-colors duration-300">
                              <Link to={`/property/${property.id}`}>View Details</Link>
                            </Button>
                          </motion.div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-6 rounded-lg bg-gray-800/70 backdrop-blur-md shadow-lg max-w-lg mx-auto border border-gray-700/50"
              >
                <AlertCircle className="mx-auto h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-2">No Listings Found</h3>
                <p className="text-gray-300">
                  We couldn't find any properties matching your selection in <span className="font-semibold">{selectedCity}</span>. Try selecting a different city or state.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Display featured properties if no search has been attempted */}
      {!searchAttempted && allProperties.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Browse Featured Properties
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {allProperties.map((property) => (
              <motion.div key={property.id} variants={itemVariants}>
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-800/70 backdrop-blur-md border border-gray-700/50">
                  <div className="relative h-48 w-full">
                    <img
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={property.title}
                      src={property.imageUrl}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-gray-800/80 text-gray-300 text-xs px-2 py-1 rounded">
                      <MapPin className="h-3 w-3 text-purple-400" />
                      <span>{property.location}, {property.city}</span>
                    </div>
                  </div>
                  <CardHeader className="pt-4 pb-2">
                    <CardTitle className="text-xl font-semibold text-white">{property.title}</CardTitle>
                    <CardDescription className="text-purple-400 font-bold text-lg flex items-center pt-1">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {property.price} / month
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3 text-sm text-gray-300 flex justify-start space-x-4">
                    <div className="flex items-center space-x-1">
                      <BedDouble className="h-4 w-4 text-purple-400" />
                      <span>{property.beds} Beds</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="h-4 w-4 text-purple-400" />
                      <span>{property.baths} Baths</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pb-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                      <Button asChild variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600/20 hover:text-white transition-colors duration-300">
                        <Link to={`/property/${property.id}`}>View Details</Link>
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;