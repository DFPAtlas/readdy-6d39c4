import ServiceDetailClient from '../../../../council/[id]/service/[cat-slug]/ServiceDetailClient';
export default function ReviewsPage({councilId, serviceId}: {councilId: string; serviceId: string}) { return <ServiceDetailClient councilId={councilId} slug={serviceId}/>; }
