import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed


export default function Survey() {
  const initialFormData = {
    dmkPromises: "",
    bestAlternative: "",
    support2026: "",
    mlaConstituency: "",
    age: "",
    sex: "",
    voteCommitment: "",
    satisfaction: "",
    frequency: "",
    recommendation: "",
    improvement: "",
    contact: "",
    feedback: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [mlaSearch, setMlaSearch] = useState("");
  const [isMlaOpen, setIsMlaOpen] = useState(false);



  const allAssemblyConstituencies = [
    'Alangulam', 'Alandur', 'Alanganallur', 'Alathur', 'Ambur', 'Anavatti', 'Andipatti', 'Anna Nagar',
    'Annur', 'Arakkonam', 'Arani', 'Aranthangi', 'Arcot', 'Ariyalur', 'Aruppukkottai', 'Attur',
    'Avanashi', 'Avadi', 'Bargur', 'Bhavani', 'Bodinayakanur', 'Bhuvanagiri', 'Budalur', 'Chepauk-Thiruvallikeni',
    'Cheranmahadevi', 'Chennai Central', 'Chennai North', 'Chennai South', 'Chengalpattu', 'Cheyyar', 'Chidambaram',
    'Chinnasalem', 'Colachel', 'Coimbatore North', 'Coimbatore South', 'Coonoor', 'Cuddalore', 'Cumbum',
    'Devakottai', 'Dharmapuri', 'Dharapuram', 'Dindigul', 'Dr. Radhakrishnan Nagar', 'Edappadi', 'Egmore',
    'Erode East', 'Erode West', 'Gangavalli', 'Gandharvakottai', 'Gingee', 'Gobichettipalayam', 'Gudalur', 'Gudiyatham',
    'Gummidipoondi', 'Harbour', 'Harur', 'Hosur', 'Jayankondam', 'Jolarpet', 'Kadaladi', 'Kadayanallur',
    'Kallakurichi', 'Kalasapakkam', 'Kalkulam', 'Kancheepuram', 'Kangeyam', 'Kanniyakumari', 'Karaikudi',
    'Karur', 'Katpadi', 'Kattumannarkoil', 'Kavundampalayam', 'Kilpennathur', 'Kilvelur', 'Kinathukadavu',
    'Kodumudi', 'Komarapalayam', 'Kotagiri', 'Kovilpatti', 'Krishnagiri', 'Krishnarayapuram', 'Kulithalai',
    'Kumbakonam', 'Kundrathur', 'Kunnam', 'Kurinjipadi', 'Lalgudi', 'Madathukulam', 'Madurai Central',
    'Madurai East', 'Madurai North', 'Madurai South', 'Madurai West', 'Maduravoyal', 'Manamadurai', 'Manachanallur',
    'Manapparai', 'Mandapam', 'Mannargudi', 'Mayiladuthurai', 'Melur', 'Mettupalayam', 'Mettur', 'Modakurichi',
    'Mudukulathur', 'Musiri', 'Mylapore', 'Nagercoil', 'Nagapattinam', 'Namakkal', 'Nanguneri', 'Nannilam',
    'Natham', 'Neyveli', 'Nilakottai', 'Oddanchatram', 'Omalur', 'Orathanadu', 'Ottapidaram', 'Padmanabhapuram',
    'Palacode', 'Palacurichi', 'Palani', 'Palayamkottai', 'Palladam', 'Pallathur', 'Pallavaram', 'Panruti',
    'Papanasam', 'Paramakudi', 'Pennagaram', 'Perambalur', 'Perambur', 'Peranamallur', 'Periyakulam', 'Perundurai',
    'Pollachi', 'Polur', 'Ponneri', 'Poonamallee', 'Pudukkottai', 'Purasawalkam', 'Radhapuram', 'Rajapalayam',
    'Ramachandrapuram', 'Ramanathapuram', 'Rameswaram', 'Ranipet', 'Rasipuram', 'Rishivandinam', 'Royapuram',
    'Saidapet', 'Salem North', 'Salem South', 'Salem West', 'Sankarankoil', 'Sankarapuram', 'Sankari',
    'Sathankulam', 'Sattur', 'Sengottai', 'Senthamangalam', 'Shenkottai', 'Sholavandan', 'Sholinganallur',
    'Sholinghur', 'Singanallur', 'Sirkali', 'Sirkazhi', 'Sivaganga', 'Sivakasi', 'Sriperumbudur', 'Srirangam',
    'Srivaikuntam', 'St. Thomas Mount', 'Sulur', 'Tambaram', 'Tenkasi', 'Tharangambadi', 'Thanjavur', 'Theni',
    'Thirumangalam', 'Thirumayam', 'Thirupparankundram', 'Thiruthuraipoondi', 'Thirukkuvalai', 'Thiruvarur',
    'Thiruvidaimarudur', 'Thiruvonam', 'Thoothukudi', 'Thousand Lights', 'Tindivanam', 'Tiruchendur',
    'Tiruchengode', 'Tiruchirappalli East', 'Tiruchirappalli West', 'Tirukoilur', 'Tirunelveli', 'Tirupathur',
    'Tiruppur North', 'Tiruppur South', 'Tiruttani', 'Tiruvallur', 'Tiruvannamalai', 'Tiruverumbur', 'Tittagudi',
    'Udayarpalayam', 'Udumalaipettai', 'Udhagamandalam', 'Ulundurpet', 'Usilampatti', 'Uthangarai', 'Uthiramerur',
    'Uthamapalayam', 'Valparai', 'Vandavasi', 'Vaniyambadi', 'Vanur', 'Vedaranyam', 'Velachery', 'Vellore',
    'Veppanahalli', 'Veerapandi', 'Veppanthattai', 'Vilavancode', 'Vilathikulam', 'Villivakkam', 'Viluppuram',
    'Viralimalai', 'Virudhachalam', 'Virudhunagar', 'Vridhachalam', 'Walajapet', 'Yercaud'
  ];

  useEffect(() => {
    const submitted = localStorage.getItem("surveySubmitted");
    if (submitted === "true") {
      setIsSubmitted(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".searchable-dropdown")) {
        setIsMlaOpen(false);
        setMlaSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const questions = [
    {
      id: "dmkPromises",
      label: "Is current DMK govt fulfilled all their promise?",
      type: "radio",
      required: true,
      options: ["Yes", "No", "Dont Know"],
    },
    {
      id: "bestAlternative",
      label: "Who is best alternative for ruling DMK",
      type: "radio",
      required: true,
      options: ["ADMK+", "TVK", "NTK", "NO one"],
    },
    {
      id: "support2026",
      label: "Your support in 2026 Election",
      type: "radio",
      required: true,
      options: ["DMK+", "ADMK+", "TVK", "NTK", "Others"],
    },
    {
      id: "mlaConstituency",
      label: "Your MLA Constituency",
      type: "searchable-select",
      required: true,
      options: allAssemblyConstituencies,
    },
    {
      id: "age",
      label: "Age",
      type: "radio",
      required: true,
      options: [
        "Less than 25",
        "25 to 35",
        "36 to 50",
        "51 to 70",
        "Greater than 70",
      ],
    },
    {
      id: "sex",
      label: "Sex",
      type: "radio",
      required: true,
      options: ["Male", "Female", "Other"],
    },
    {
      id: "voteCommitment",
      label: "Are you committed to vote on Election Date",
      type: "radio",
      required: true,
      options: [
        "Yes",
        "No. I Live outside tamilnadu/India",
        "No but influence in family/friend circle",
      ],
    },
  ];

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            resolve(
              `${data.city}, ${data.principalSubdivision}, ${data.countryName}`
            );
          } catch {
            resolve(
              `${position.coords.latitude.toFixed(
                4
              )}, ${position.coords.longitude.toFixed(4)}`
            );
          }
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const saveToLocalStorage = (data) => {
    const existingData = JSON.parse(localStorage.getItem("surveyData") || "[]");
    existingData.push(data);
    localStorage.setItem("surveyData", JSON.stringify(existingData));
    localStorage.setItem("surveySubmitted", "true");
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate required fields
  //   const requiredFields = questions.filter((q) => q.required).map((q) => q.id);
  //   const missingFields = requiredFields.filter((field) => !formData[field]);

  //   if (missingFields.length > 0) {
  //     setToastMessage("Please fill in all required fields!");
  //     setShowToast(true);
  //     setTimeout(() => setShowToast(false), 3000);
  //     return;
  //   }

  //   const currentTime = new Date().toLocaleString("en-US", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //     hour12: true,
  //   });

  //   let location;
  //   try {
  //     location = await getCurrentLocation();
  //   } catch (error) {
  //     location = "Location access denied or unavailable";
  //   }

  //   const submissionData = { ...formData, submittedAt: currentTime, location };

  //   saveToLocalStorage(submissionData);
  //   console.log("Survey Submission:", submissionData);
  //   setIsSubmitted(true);
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate required fields
  const requiredFields = questions.filter((q) => q.required).map((q) => q.id);
  const missingFields = requiredFields.filter((field) => !formData[field]);

  if (missingFields.length > 0) {
    setToastMessage("Please fill in all required fields!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    return;
  }

  let location;
  try {
    location = await getCurrentLocation();
  } catch (error) {
    location = "Location access denied or unavailable";
  }

  const submissionData = {
    submittedAt: serverTimestamp(), // Firestore timestamp
    location,
//    deviceId: "WEB_" + Math.random().toString(36).substr(2, 9), // example device ID
    answers: { ...formData }
  };

  try {
    // Send to Firestore
    await addDoc(collection(db, "responses"), submissionData);
    console.log("Survey submitted:", submissionData);

    setIsSubmitted(true);
  } catch (err) {
    console.error("Error submitting survey:", err);
    setToastMessage("Failed to submit survey. Please try again.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }
};

  const renderQuestion = (question, index) => {
    const { id, label, type, required, options, optionLabels, placeholder } =
      question;
    const questionNumber = index + 1;
    const labelText = `${questionNumber}. ${label}${required ? " *" : ""}`;

    if (type === "input" || type === "tel") {
      return (
        <div key={id} className="space-y-2">
          <Label htmlFor={id} className="text-sm sm:text-base font-medium">
            {labelText}
          </Label>
          <Input
            id={id}
            type={type === "tel" ? "tel" : "text"}
            value={formData[id]}
            onChange={(e) => handleInputChange(id, e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full h-10 text-sm sm:text-base"
          />
        </div>
      );
    }

    if (type === "radio") {
      return (
        <div key={id} className="space-y-3">
          <Label className="text-sm sm:text-base font-medium">
            {labelText}
          </Label>
          <div className="space-y-2">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name={id}
                  value={option}
                  checked={formData[id] === option}
                  onChange={(e) => handleInputChange(id, e.target.value)}
                  className="text-blue-600 w-4 h-4"
                  required={required}
                />
                <span className="text-sm sm:text-base">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (type === "searchable-select") {
      const filteredOptions = options.filter(option => 
        option.toLowerCase().includes(mlaSearch.toLowerCase())
      );

      return (
        <div key={id} className="space-y-2 relative searchable-dropdown">
          <Label htmlFor={id} className="text-sm sm:text-base font-medium">
            {labelText}
          </Label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMlaOpen(!isMlaOpen)}
              className="w-full h-10 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {formData[id] || `Select ${label.toLowerCase()}`}
              <svg
                className="absolute right-3 top-3 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isMlaOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                <div className="p-2 border-b">
                  <Input
                    type="text"
                    placeholder="Search constituencies..."
                    value={mlaSearch}
                    onChange={(e) => setMlaSearch(e.target.value)}
                    className="w-full h-8 text-sm"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          handleInputChange(id, option);
                          setIsMlaOpen(false);
                          setMlaSearch("");
                        }}
                        className="w-full px-3 py-2 text-left text-sm sm:text-base hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {option}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No constituencies found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (type === "select") {
      return (
        <div key={id} className="space-y-2">
          <Label htmlFor={id} className="text-sm sm:text-base font-medium">
            {labelText}
          </Label>
          <Select
            value={formData[id]}
            onValueChange={(value) => handleInputChange(id, value)}
            required={required}
          >
            <SelectTrigger className="h-10 text-sm sm:text-base">
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, idx) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="text-sm sm:text-base"
                >
                  {optionLabels ? optionLabels[idx] : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
  };

  const Toast = ({ message, show }) => {
    if (!show) return null;

    return (
      <div className="fixed top-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-sm z-50 bg-red-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-top-2">
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span className="text-sm sm:text-base">{message}</span>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <Card className="text-center shadow-sm">
            <CardContent className="pt-6 px-4 sm:px-6">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Thank You!
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm sm:text-base">
                Thank you for your response. Your feedback has been successfully
                recorded.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <Toast message={toastMessage} show={showToast} />
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-sm">
          <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              V-Survey
            </CardTitle>
            <CardDescription className="text-base sm:text-lg mt-2">
              Participate in this survey to express your thoughts on governance
              and the upcoming elections.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-4 sm:space-y-6">
                {questions.map((question, index) =>
                  renderQuestion(question, index)
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
              >
                Submit Survey
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
