




import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, BedDouble, Bath, DollarSign, Home, Heart, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log(`Fetching property with id: ${id}`);
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
        console.log('Fetched property:', response.data);
        setProperty(response.data);
      } catch (err) {
        const errorMsg = err.response
          ? `Status: ${err.response.status}, Message: ${JSON.stringify(err.response.data)}`
          : err.message;
        console.error('Axios fetch error:', errorMsg);
        setError(errorMsg);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load property details. Please try again later.",
          duration: 5000,
          className: "bg-gray-800 text-white border-red-500",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, toast]);

  const handleShortlist = () => {
    if (!property) return;
    toast({
      title: "Added to Shortlist!",
      description: `${property.title} has been saved.`,
      duration: 3000,
      action: (
        <Button variant="outline" size="sm" asChild>
          <Link to="/shortlist">View Shortlist</Link>
        </Button>
      ),
      className: "bg-gray-800 text-white border-purple-500",
    });
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

  if (error || !property) {
    return (
      <div className="text-center py-10 bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto"
        >
          <AlertCircle className="mx-auto h-12 w-12 text-purple-400 mb-4" />
          <h2 className="text-2xl font-semibold text-purple-400 mb-2">Property Not Found</h2>
          <p className="text-gray-400 mb-4">
            The property with ID {id} could not be found. Please check the ID or try again later.
          </p>
          <Button asChild variant="link">
            <Link to="/" className="flex items-center justify-center text-purple-400 hover:text-purple-300">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go back to listings
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-6 bg-gray-900 min-h-screen"
    >
      <Button
        asChild
        variant="outline"
        size="sm"
        className="mb-6 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white backdrop-blur-sm"
      >
        <Link to="/" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl bg-gray-800/70 backdrop-blur-md border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            <img
              className="w-full h-64 object-cover rounded-lg shadow-md"
              alt={`${property.title} main view`}
              src={property.imageUrl1 || property.imageUrl}
            />
          </motion.div>
          {/* <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            <img
              className="w-full h-64 object-cover rounded-lg shadow-md"
              alt={`${property.title} interior view`}
              src={property.imageUrl2 || property.imageUrl}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            <img
              className="w-full h-64 object-cover rounded-lg shadow-md"
              alt={`${property.title} feature view`}
              src={property.imageUrl3 || property.imageUrl}
            />
          </motion.div> */}
        </div>

        <CardHeader className="pt-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-white mb-1">{property.title}</CardTitle>
              <CardDescription className="text-lg text-gray-300 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-400" />
                {property.location}, {property.city}, {property.state}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white flex items-center justify-end">
                <DollarSign className="h-7 w-7 mr-1 text-purple-400" />
                {property.price}
              </p>
              <p className="text-sm text-gray-400">per month</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 text-gray-200 border-t border-b border-gray-700/50 py-4">
            <div className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-md">
              <BedDouble className="h-5 w-5 text-purple-400" />
              <span>{property.beds} Bedrooms</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-md">
              <Bath className="h-5 w-5 text-purple-400" />
              <span>{property.baths} Bathrooms</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-md">
              <Home className="h-5 w-5 text-purple-400" />
              <span>{property.beds > 0 ? 'Apartment/House' : 'Studio'}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Description</h3>
            <p className="text-gray-300 leading-relaxed">
              {property.description || 'No description available.'}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-white">Amenities</h3>
            <div className="flex flex-wrap gap-3">
              {(property.amenities || []).map((amenity, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md"
                >
                  {amenity}
                </motion.span>
              ))}
              {(!property.amenities || property.amenities.length === 0) && (
                <p className="text-gray-300 leading-relaxed">No amenities listed.</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-6 border-t border-gray-700/50 flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg hover:from-purple-700 hover:to-purple-900 text-base"
                >
                  Contact Landlord
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="bg-gray-800/90 backdrop-blur-md text-white border border-gray-700/50">
              <DialogHeader>
                <DialogTitle className="text-purple-400">Contact Landlord</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Interested in {property.title}? Send a message to the landlord.
                </DialogDescription>
              </DialogHeader>
              <form
              // for the view appilcations
                onSubmit={async e => {
                  e.preventDefault();
                  if (!contactForm.name || !contactForm.email || !contactForm.message) {
                    setFormError('Please fill all required fields.');
                    return;
                  }
                  setFormError('');
                  try {
                    await axios.post('http://localhost:5000/api/messages', {
                      propertyId: property.id,
                      propertyTitle: property.title,
                      userName: contactForm.name,
                      userEmail: contactForm.email,
                      userPhone: contactForm.phone,
                      message: contactForm.message
                    });
                    toast({
                      title: "Message Sent!",
                      description: "The landlord will get back to you soon.",
                      duration: 4000,
                      className: "bg-gray-800 text-white border-purple-500",
                    });
                    setContactForm({ name: '', email: '', phone: '', message: '' });
                  } catch (err) {
                    toast({
                      variant: 'destructive',
                      title: 'Error',
                      description: err.response?.data?.message || 'Failed to send message. Please try again.',
                      className: "bg-gray-800 text-white border-red-500",
                    });
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block font-medium text-gray-300">Name *</label>
                  <input
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:ring focus:ring-purple-500/30"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-300">Email *</label>
                  <input
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:ring focus:ring-purple-500/30"
                    type="email"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-300">Phone (Optional)</label>
                  <input
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:ring focus:ring-purple-500/30"
                    value={contactForm.phone}
                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-300">Message *</label>
                  <textarea
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:ring focus:ring-purple-500/30"
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  />
                </div>
                {formError && <div className="text-red-400">{formError}</div>}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Send Message
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              onClick={handleShortlist}
              className="border-purple-600 text-purple-400 hover:bg-purple-600/20 hover:text-white"
            >
              <Heart className="mr-2 h-5 w-5" /> Add to Shortlist
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PropertyDetailsPage;