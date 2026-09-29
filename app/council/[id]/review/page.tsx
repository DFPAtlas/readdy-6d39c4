import ReviewClient from './ReviewClient';

export async function generateStaticParams() {
  return [
    { id: 'westminster' },
    { id: 'kent' },
    { id: 'manchester' },
    { id: 'surrey' },
    { id: 'birmingham' },
    { id: 'essex' },
    { id: 'bristol' },
    { id: 'cambridgeshire' },
    { id: 'camden' },
    { id: 'hampshire' },
    { id: 'leeds' },
    { id: 'oxfordshire' },
    { id: 'hertfordshire' },
  ];
}

export default async function WriteReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewClient councilId={id} />;
}
