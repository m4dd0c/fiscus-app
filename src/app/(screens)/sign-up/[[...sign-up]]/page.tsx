import { SignUp } from "@clerk/nextjs";

export default function Page() {
 return (
  <div className="h-screen w-full grid place-items-center bg-black">
   <SignUp />
  </div>
 );
}
