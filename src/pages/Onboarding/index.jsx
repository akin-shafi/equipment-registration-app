import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/useSession"; // Access AuthContext
import { toast } from "react-toastify";
import OnboardingStepContent from "./OnboardingStepContent";
import OnboardingTopNav from "@/components/onboarding/TopNav";
import AsideLeft from "@/components/onboarding/SideNav";
import Alert from "@/components/custom/Alert";
import validateStepData from "@/components/onboarding/validateStepData";

export function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Access location for query params
  const [isSaving, setIsSaving] = useState(false); // Added isSaving state
  const { session } = useSession();
  const token = session.token;
  const tenantId = session?.user?.tenantId;
  const username = `${session?.user?.firstName || ""} ${
    session?.user?.lastName || ""
  }`;

  const queryParams = new URLSearchParams(location.search); // Parse query string
  const step = queryParams.get("step"); // Get the step query parameter
  const [currentStep, setCurrentStep] = useState(Number(step) || 0); // Initialize step

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);

  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);

  const toggleSideNav = () => {
    setIsSideNavOpen((prev) => !prev);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        closeSideNav();
      }
    };

    if (isSideNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideNavOpen]);

  // useEffect(() => {
  //   if (!state || !state?.token) {
  //     navigate("/");
  //   }
  // }, [state, navigate]);

  const steps = [
   
    {
      label: "Team Members",
      message: "Add details.",
      description: "Add property type and policies.",
    },
    {
      label: "Rooms Setup",
      message: "Configure rooms.",
      description: "Room details and amenities.",
    },
  ];

  const stepEndpoints = ["user", "property-details", "rooms"];

  useEffect(() => {
    if (step) {
      const stepIndex = parseInt(step, 10) - 1;
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStep(stepIndex);
      }
    }
  }, [step]);

  const handleSaveAndNext = async () => {
    const stepName = stepEndpoints[currentStep];
    const endpoint = `${import.meta.env.VITE_BASE_URL}/${stepName}`;
    const camelCaseStepName = stepName.replace(/-([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );

    const { isValid, errors } = validateStepData(currentStep, formData);

    if (!isValid) {
      setValidationErrors(errors);
      toast.error("Validation failed. Please check your input.");
      return;
    }

    setValidationErrors("");

    const stepData = formData[camelCaseStepName] || {};

    try {
      setIsSaving(true);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...stepData, tenantId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        setIsSaving(false);
        return;
      }

      if (currentStep === steps.length - 1) {
        toast.success("Onboarding complete!");
        navigate("/onboarding/congratulations");
      } else {
        toast.success("Step saved successfully!");
        handleNext();
      }

      setError(null);
    } catch (err) {
      setError(err.message || "An error occurred.");
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    navigate(`/onboarding?step=${nextStep + 1}`);
    setCurrentStep(nextStep);
  };

  const handlePrevious = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    navigate(`/onboarding?step=${prevStep + 1}`);
    setCurrentStep(prevStep);
  };

  const handleFormChange = (data) => {
    const currentStepName = stepEndpoints[currentStep];
    const camelCaseStepName = currentStepName.replace(
      /-([a-z])/g,
      (_, letter) => letter.toUpperCase()
    );
    setFormData((prev) => ({
      ...prev,
      [camelCaseStepName]: { ...prev[camelCaseStepName], ...data },
    }));
  };

  return (
    <div className="w-screen h-screen flex md:flex-row flex-col bg-[#F7F9FC] overflow-hidden">
      <OnboardingTopNav onMenuClick={toggleSideNav} />
      <div className="flex w-full h-full">
        <AsideLeft
          isOpen={isSideNavOpen}
          onClose={toggleSideNav}
          ref={sideNavRef}
          steps={steps.map((step) => step.label)}
          stepMessages={steps.map((step) => step.message)}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
        <div className="flex-1 w-full h-[92vh] mt-[9vh] overflow-y-auto scroller bg-white">
          <div className="md:w-4/5 w-[90%] mx-auto">
            <div className="w-full my-5">
              <h4 className="md:text-[18px] text-[16px] font-medium my-3 capitalize">
                Welcome {username}
              </h4>
              <h5 className="md:text-[18px] text-[16px] font-medium text-[#101828]">
                {steps[currentStep]?.label}
              </h5>
              <p className="md:text-[14px] text-[12px] text-[#475467] font-azoSansRegular">
                {steps[currentStep]?.description}
              </p>
            </div>
            <OnboardingStepContent
              currentStep={currentStep}
              formData={formData}
              handleFormChange={handleFormChange}
              steps={steps}
            />
            {error && <Alert message={error} />}
            {validationErrors && <Alert message={validationErrors} />}
            <div className="flex justify-between my-10">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="w-full mr-5 bg-gray-300 px-4 py-2 rounded-full"
              >
                Previous
              </button>
              <button
                onClick={handleSaveAndNext}
                disabled={isSaving}
                className="w-full bg-appGreen hover:bg-appGreenLight transition duration-500 text-white border border-[#FFF] px-4 py-2 rounded-full"
              >
                {isSaving
                  ? "Saving..."
                  : currentStep === steps.length - 1
                  ? "Submit"
                  : "Save & Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
