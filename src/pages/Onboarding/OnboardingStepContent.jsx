/* eslint-disable react/prop-types */
import PersonalDetails from "@/components/onboarding/forms/PersonalDetails";
// import TeamMembers from "@/components/onboarding/forms/TeamMembers";
const OnboardingStepContent = ({
  currentStep,
  // formData,
  handleFormChange,
  steps,
}) => {
  // Validate currentStep and steps array to avoid runtime errors
  if (!steps || currentStep < 0 || currentStep >= steps.length) {
    return <p>Error: Invalid step</p>;
  }

  const currentStepName = steps[currentStep]?.label;

  const renderStepContent = () => {
    switch (currentStepName) {
      case "User Profile":
        return (
          <PersonalDetails
            onChange={handleFormChange}
            // formData={formData.PropertyDetails}
          />
        );

      default:
        return <p>Step not found</p>;
    }
  };

  return <div>{renderStepContent()}</div>;
};

export default OnboardingStepContent;
