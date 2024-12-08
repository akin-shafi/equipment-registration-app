import Nigeria from "@/assets/nadf.png";
import Logo from "@/assets/images/logo-dark.png";

export default function WhiteLogo() {
  return (
    <div className="flex justify-center item-center mb-2">
      <img src={Nigeria} width={150} height={150} className="mr-2" />
      <img src={Logo} width={100} height={120} />
    </div>
  );
}
