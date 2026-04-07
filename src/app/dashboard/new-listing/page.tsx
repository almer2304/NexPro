import { Metadata } from "next";
import { NewListingForm } from "./listing-form";

export const metadata: Metadata = { title: "New Listing | Dashboard" };

export default function NewListingPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#000802]">Create New Listing</h1>
        <p className="text-sm text-[#476083] font-label mt-1">Fill in the details to list your property on NexPro</p>
      </div>
      <NewListingForm />
    </div>
  );
}
