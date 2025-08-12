import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import api from "../api/api";

export default function Search() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [outboundDate, setOutboundDate] = useState("");
  const [stayDays, setStayDays] = useState(1);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);

    if (!origin || !destination || !outboundDate || stayDays <= 0) {
      setError("Please fill all fields and enter valid stay days.");
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get<{ flights: any[] }>("/search", {
        origin,
        destination,
        outbound_date: outboundDate,
        stay_days: stayDays,
      });

      setResults(res.flights || []);
    } catch (err) {
      setError("Search failed.");
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper: napravi link ka Skyscanner za dati origin, dest i datum (outboundDate)
  const getBookingLink = (origin: string, destination: string, outboundDate: string) => {
    // format datuma YYYY-MM-DD u YYYYMMDD za Skyscanner link
    const dateFormatted = outboundDate.replace(/-/g, "");
    return `https://www.skyscanner.net/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${dateFormatted}/`;
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Search Round-Trip Flights</h1>

      <div className="space-y-3">
        <Input
          placeholder="Origin Airport Code (e.g. BEG)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          maxLength={3}
          className="uppercase"
        />
        <Input
          placeholder="Destination Airport Code (e.g. CDG)"
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
          maxLength={3}
          className="uppercase"
        />
        <Input
          type="date"
          value={outboundDate}
          onChange={(e) => setOutboundDate(e.target.value)}
        />
        <Input
          type="number"
          min={1}
          placeholder="Stay duration in days"
          value={stayDays}
          onChange={(e) => setStayDays(parseInt(e.target.value) || 1)}
        />
      </div>

      <Button onClick={handleSearch} disabled={loading} className="w-full">
        {loading ? "Searching..." : "Search"}
      </Button>

      {error && <p className="text-red-600 text-center mt-2">{error}</p>}

      {results && results.length > 0 && (
        <div className="space-y-6 mt-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Flights</h2>

          {results.map((f, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200"
            >
              
                <p className="mb-1">
                  <span className="font-semibold">Airline:</span> {f.segments[0]?.airline}
                </p>
              
              <p className="mb-1">
                <span className="font-semibold">Price:</span>{" "}
                {f.price != null ? `$${f.price.toFixed(2)}` : "N/A"}
              </p>

              <p className="mb-3">
                <a
                  href={getBookingLink(origin, destination, outboundDate)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Book on Skyscanner
                </a>
              </p>

              <div>
                <p className="font-semibold mb-2">Segments:</p>
                {Array.isArray(f.flights) && f.flights.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {f.flights.map((seg: any, idx: number) => (
                      <li key={idx}>
                        {seg.airline && (
                          <span className="font-semibold">{seg.airline}</span>
                        )}{" "}
                        Flight{" "}
                        <span className="font-semibold">{seg.flight_number ?? "N/A"}</span>{" "}
                        from{" "}
                        <span className="font-semibold">
                          {seg.departure_airport?.airport_code ?? "N/A"}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold">
                          {seg.arrival_airport?.airport_code ?? "N/A"}
                        </span>{" "}
                        at {seg.departure_airport?.time ?? "Unknown time"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No segment details available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {results && results.length === 0 && !loading && (
        <p className="text-center text-gray-600 mt-6">No flights found.</p>
      )}
    </div>
  );
}
