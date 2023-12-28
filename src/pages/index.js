export async function getServerSideProps(context) {
  return {
      redirect: {
          destination: '/login',
          permanent: false,
      },
  };
}

export default function Home() {
  return (
      <div>
          {/* Your home page content (optional) */}
      </div>
  );
}
