import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { AnimatedLanding } from "./_components/landing-page";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  // نمرر حالة تسجيل الدخول كقيمة منطقية للمكون التفاعلي
  return <h1>Hello, World!</h1>
}



// "use client";

// import { useEffect, useRef, useState } from "react";

// /**
//  * Adds an element to the DOM and flips `inView` to true once it scrolls
//  * into the viewport. Fires once, then disconnects the observer.
//  */
// export function useInView<T extends HTMLElement = HTMLDivElement>(
//   options: IntersectionObserverInit = { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
// ) {
//   const ref = useRef<T | null>(null);
//   const [inView, setInView] = useState(false);

//   useEffect(() => {
//     const node = ref.current;
//     if (!node) return;

//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         setInView(true);
//         observer.unobserve(node);
//       }
//     }, options);

//     observer.observe(node);
//     return () => observer.disconnect();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return { ref, inView };
// }
