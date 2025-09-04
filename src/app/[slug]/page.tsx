import { getPropertyTypeForUrl, getOperationForUrl } from "@/lib/utils";

interface SearchResultsPageProps {
  params: {
    slug: string[];
  };
}

export default function SearchResultsPage({ params }: SearchResultsPageProps) {
  const { slug } = params;

  return (
    <div className="container mx-auto py-8">
      <p>Slug recibido: {JSON.stringify(slug)}</p>
    </div>
  );
}
