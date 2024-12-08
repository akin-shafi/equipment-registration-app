import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { toast } from "react-toastify";
import OnboardingStepContent from "./OnboardingStepContent";
import OnboardingTopNav from "@/components/onboarding/TopNav";
import AsideLeft from "@/components/onboarding/SideNav";
import Alert from "@/components/custom/Alert";
import validateStepData from "@/components/onboarding/validateStepData";
import { useOnboarding } from "@/hooks/useOnboarding";

export function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSession();
  const token = session?.token;
  const tenantId = session?.user?.tenantId;
  const username = `${session?.user?.firstName || ""} ${
    session?.user?.lastName || ""
  }`;

  const [currentStep, setCurrentStep] = useState(
    parseInt(new URLSearchParams(location.search).get("step"), 10) - 1 || 0
  );
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState(null);
  const [error, setError] = useState(null);

  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);

  const steps = [
    { label: "User Profile", description: "Update your personal info." },
    { label: "Team Members", description: "Add details for your team." },
    { label: "Rooms Setup", description: "Configure rooms and amenities." },
  ];

  const { endpoint, method, headers, body } = useOnboarding(currentStep);

  const toggleSideNav = () => setIsSideNavOpen((prev) => !prev);

  const handleOutsideClick = useCallback((event) => {
    if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
      setIsSideNavOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isSideNavOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSideNavOpen, handleOutsideClick]);

  const handleStepNavigation = useCallback(
    (step) => {
      setCurrentStep(step);
      navigate(`/onboarding?step=${step + 1}`);
    },
    [navigate]
  );

  const handleFormChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      [currentStep]: { ...prev[currentStep], ...data },
    }));
  };

  const handleSaveAndNext = async () => {
    const stepData = formData[currentStep] || {};
    const { isValid, errors } = validateStepData(currentStep, stepData);

    if (!isValid) {
      setValidationErrors(errors);
      toast.error("Validation failed. Please check your input.");
      return;
    }

    setValidationErrors(null);

    try {
      setIsSaving(true);
      const response = await fetch(endpoint(), {
        method,
        headers: headers(token),
        body: body({ ...stepData, tenantId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      if (currentStep === steps.length - 1) {
        toast.success("Onboarding complete!");
        navigate("/onboarding/congratulations");
      } else {
        toast.success("Step saved successfully!");
        handleStepNavigation(currentStep + 1);
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
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
          currentStep={currentStep}
          onStepChange={handleStepNavigation}
        />
        <main className="flex-1 w-full h-[92vh] mt-[9vh] overflow-y-auto scroller bg-white">
          <section className="md:w-4/5 w-[90%] mx-auto">
            <header className="my-5">
              <h4 className="text-[16px] font-medium">Welcome, {username}</h4>
              <h5 className="text-[16px] font-medium text-[#101828]">
                {steps[currentStep]?.label}
              </h5>
              <p className="text-[12px] text-[#475467]">
                {steps[currentStep]?.description}
              </p>
            </header>
            <OnboardingStepContent
              currentStep={currentStep}
              formData={formData}
              handleFormChange={handleFormChange}
            />
            {error && <Alert message={error} />}
            {validationErrors && <Alert message={validationErrors} />}
            <div className="flex justify-between my-10">
              <button
                onClick={() =>
                  handleStepNavigation(Math.max(currentStep - 1, 0))
                }
                disabled={currentStep === 0}
                className="w-full mr-5 bg-gray-300 px-4 py-2 rounded-full"
              >
                Previous
              </button>
              <button
                onClick={handleSaveAndNext}
                disabled={isSaving}
                className="w-full bg-appGreen hover:bg-appGreenLight transition duration-500 text-white px-4 py-2 rounded-full"
              >
                {isSaving
                  ? "Saving..."
                  : currentStep === steps.length - 1
                  ? "Submit"
                  : "Save & Next"}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
