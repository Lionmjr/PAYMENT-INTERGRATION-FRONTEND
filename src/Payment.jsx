import React, { useState } from 'react';
import { Loader2, CheckCircle, X } from 'lucide-react';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'KES',
    description: '',
    billing_address: {
      email_address: '',
      phone_number: '',
      country_code: 'KE',
      first_name: '',
      last_name: '',
      line_1: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);

  const handleInputChange = (e, isAddressField = false) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (isAddressField) {
        return {
          ...prev,
          billing_address: {
            ...prev.billing_address,
            [name]: value
          }
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/payments/initiate-payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      const data = await response.json();
      if (response.ok) {
        setPaymentResponse(data);
        setShowModal(true);
        setStatus('Payment initiated successfully!');
      } else {
        setStatus('Error initiating payment: ' + data.error);
      }
    } catch (error) {
      setStatus('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Payment Details</h2>
        {status && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            {status}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">KES</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.billing_address.first_name}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.billing_address.last_name}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email_address"
                  value={formData.billing_address.email_address}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.billing_address.phone_number}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="line_1"
                  value={formData.billing_address.line_1}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Processing...</span>
              </>
            ) : (
              <span>Proceed to Payment</span>
            )}
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                <h3 className="text-lg font-semibold">Payment Initiated Successfully</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Order ID:</span> {paymentResponse?.order_tracking_id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Reference:</span> {paymentResponse?.merchant_reference}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <a
                href={paymentResponse?.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Continue to Payment
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentForm;