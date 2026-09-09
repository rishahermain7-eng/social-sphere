function RightSidebar() {
  return (
    <div className="right-sidebar-content">
      <section className="welcome-card">
        <p>Welcome back,</p>
        <h2>Risha 👋</h2>
        <span>Share your ideas, moments, and inspire others.</span>
      </section>

      <section className="side-card">
        <div className="side-card-header">
          <h3>Trending Topics</h3>
          <button>See all</button>
        </div>

        <div className="trend">#BuildInPublic</div>
        <div className="trend">#StudentLife</div>
        <div className="trend">#CreativeMinds</div>
        <div className="trend">#TechForGood</div>
      </section>

      <section className="side-card">
        <div className="side-card-header">
          <h3>Suggested Creators</h3>
          <button>See all</button>
        </div>

        <div className="suggestion">
          <div className="avatar small">A</div>
          <div>
            <strong>Aanya Verma</strong>
            <span>@aanyaverma</span>
          </div>
          <button>Follow</button>
        </div>

        <div className="suggestion">
          <div className="avatar small">K</div>
          <div>
            <strong>Kunal Sharma</strong>
            <span>@kunalsharma</span>
          </div>
          <button>Follow</button>
        </div>
      </section>
    </div>
  );
}

export default RightSidebar;