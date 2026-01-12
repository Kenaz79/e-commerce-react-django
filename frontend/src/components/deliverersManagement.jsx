import { 
  Plus, 
  X, 
  User, 
  Phone, 
  Car, 
  MapPin, 
  Package, 
  Star 
} from 'lucide-react';

// Add this LoadingSpinner component (or import it if it's defined elsewhere)
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
  </div>
);
const DeliverersManagement = ({ 
  loading, 
  deliverers, 
  showAddDeliverer, 
  setShowAddDeliverer, 
  newDeliverer, 
  setNewDeliverer, 
  handleAddDeliverer, 
  toggleDelivererOnline, 
  deleteDeliverer 
}) => {
  if (loading.deliverers) return <LoadingSpinner />;
  
  return (
    <div className="space-y-6 dark:text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Deliverers Management</h2>
        <button
          onClick={() => setShowAddDeliverer(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Deliverer
        </button>
      </div>

      {showAddDeliverer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Add New Deliverer</h3>
              <button 
                type="button" 
                onClick={() => {
                  setShowAddDeliverer(false);
                  // Reset the main newDeliverer state
                  setNewDeliverer({
                    name: '',
                    email: '',
                    phone: '',
                    vehicleType: '',
                    licensePlate: '',
                    area: ''
                  });
                }}
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>
            <form onSubmit={handleAddDeliverer} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newDeliverer.name}
                onChange={(e) => setNewDeliverer({...newDeliverer, name: e.target.value})}
                className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
                autoFocus
              />
              <input
                type="email"
                placeholder="Email"
                value={newDeliverer.email}
                onChange={(e) => setNewDeliverer({...newDeliverer, email: e.target.value})}
                className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newDeliverer.phone}
                onChange={(e) => setNewDeliverer({...newDeliverer, phone: e.target.value})}
                className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
              />
              <select
                value={newDeliverer.vehicleType}
                onChange={(e) => setNewDeliverer({...newDeliverer, vehicleType: e.target.value})}
                className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Car">Car</option>
                <option value="Bicycle">Bicycle</option>
                <option value="Van">Van</option>
              </select>
              <input
                type="text"
                placeholder="License Plate"
                value={newDeliverer.licensePlate}
                onChange={(e) => setNewDeliverer({...newDeliverer, licensePlate: e.target.value})}
                className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Service Area"
                value={newDeliverer.area}
                onChange={(e) => setNewDeliverer({...newDeliverer, area: e.target.value})}
                className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 text-white py-2 rounded-lg font-semibold hover:bg-cyan-600"
                >
                  Add Deliverer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDeliverer(false);
                    setNewDeliverer({
                      name: '',
                      email: '',
                      phone: '',
                      vehicleType: '',
                      licensePlate: '',
                      area: ''
                    });
                  }}
                  className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-white py-2 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliverers.map((deliverer) => (
          <div key={deliverer.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white">{deliverer.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{deliverer.vehicle_type}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${deliverer.online ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="dark:text-gray-300">{deliverer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="dark:text-gray-300">{deliverer.vehicle_type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="dark:text-gray-300">{deliverer.area}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="dark:text-gray-300">{deliverer.totalDeliveries} deliveries</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold dark:text-white">{deliverer.rating}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  deliverer.online ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {deliverer.online ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleDelivererOnline(deliverer.id)}
                  className={`flex-1 py-2 rounded-lg font-semibold text-sm ${
                    deliverer.online 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {deliverer.online ? 'Take Offline' : 'Bring Online'}
                </button>
                <button
                  onClick={() => deleteDeliverer(deliverer.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DeliverersManagement;