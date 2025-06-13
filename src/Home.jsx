
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-50 to-white">
      
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/48/Emoji_u1f34b.svg" // Lemon icon
          alt="Lemon Logo"
          className="w-20 h-20 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">
          Welcome to Lemon Software Solution
        </h1>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          We develop modern, scalable ERP solutions designed to streamline operations,
          enhance productivity, and drive growth for businesses of all sizes.
        </p>
      </section>

      {/* ERP Features */}
      <section className="py-12 bg-white px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 shadow rounded-lg border">
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">Inventory Management</h3>
            <p className="text-gray-600">Track, control, and manage your stock levels with ease.</p>
          </div>
          <div className="p-6 shadow rounded-lg border">
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">Billing & Invoicing</h3>
            <p className="text-gray-600">Create automated invoices and manage customer payments smoothly.</p>
          </div>
          <div className="p-6 shadow rounded-lg border">
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">Reports & Analytics</h3>
            <p className="text-gray-600">Make data-driven decisions using real-time reports and dashboards.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-yellow-100 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to grow your business?
        </h2>
        <p className="text-gray-700 mb-6">
          Join hundreds of businesses who trust Lemon Software Solution for their ERP needs.
        </p>
        <a
          href="#"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-full transition"
        >
          Get a Free Demo
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Lemon Software Solution — Building Smart ERP for Smart Businesses.
        </p>
      </footer>
    </div>
  );
}
