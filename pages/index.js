import dynamic from "next/dynamic";

const LayoutComponent = dynamic(() => import("../containers/layout"));

export default function Home() {
  return <LayoutComponent metaTitle="Home">Index</LayoutComponent>;
}
