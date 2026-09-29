import ServiceDetailClient from './ServiceDetailClient';

const councils = [
  'westminster','kent','manchester','surrey','birmingham','essex',
  'bristol','cambridgeshire','camden','hampshire','leeds','oxfordshire','hertfordshire'
];

const services = ['waste','parking','planning','housing','highways','education'];

export async function generateStaticParams() {
  return councils.flatMap(id => services.map(slug => ({ id, 'cat-slug': slug })));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string; 'cat-slug': string }>;
}) {
  const { id, 'cat-slug': slug } = await params;
  return <ServiceDetailClient councilId={id} slug={slug} />;
}
