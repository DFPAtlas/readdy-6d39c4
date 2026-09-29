import CouncilDetail from './CouncilDetail';

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
  ];
}

export default async function CouncilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CouncilDetail councilId={id} />;
}
