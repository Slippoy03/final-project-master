import dynamic from "next/dynamic";

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Home() {
  return <LayoutComponent metaTitle="Home">Index</LayoutComponent>;
}
