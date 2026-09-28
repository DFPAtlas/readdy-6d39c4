import ReviewsPage from './ReviewsPage';

export async function generateStaticParams() {
  return [
    { councilId: 'westminster', serviceId: 'parking' },
    { councilId: 'westminster', serviceId: 'planning' },
    { councilId: 'westminster', serviceId: 'housing' },
    { councilId: 'kent', serviceId: 'highways' },
    { councilId: 'kent', serviceId: 'education' },
    { councilId: 'manchester', serviceId: 'benefits' },
  ];
}

export default async function ServiceReviewsPage({ params }: { params: Promise<{ councilId: string; serviceId: string }> }) {
  const { councilId, serviceId } = await params;
  return <ReviewsPage councilId={councilId} serviceId={serviceId} />;
}