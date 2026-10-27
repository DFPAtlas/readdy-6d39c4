import Header from "../../components/lv/Header";
import Footer from "../../components/lv/Footer";
export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-4 lg:p-8 space-y-5">
        <h1 className="text-3xl font-bold">Contact and support</h1>
        <p>
          For account queries, data access, account deletion or a review report,
          email{" "}
          <a
            className="text-blue-700 underline"
            href="mailto:hello@localverdict.co.uk"
          >
            hello@localverdict.co.uk
          </a>
          .
        </p>
        <p>
          For account requests, contact us from your registered email. For
          review reports, include the council, review title, author and reason
          for your report. Do not send passwords or sensitive identity documents
          by email.
        </p>
        <p>
          Email requests are handled manually. Opening your email app does not
          submit a request: please send the email and keep a copy.
        </p>
        <p>
          For an issue with a council service, use that council’s official
          complaints procedure. This independent review site cannot submit or
          resolve council complaints on your behalf.
        </p>
      </main>
      <Footer />
    </>
  );
}
