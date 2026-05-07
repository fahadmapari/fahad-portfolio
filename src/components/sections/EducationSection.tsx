import { Panel } from "../Panel";

export function EducationSection() {
  return (
    <Panel title="05 :: TRAINING" tag="academic.record">
      <div className="exp-head">
        <div>
          <div className="role">M.Sc. Computer Application</div>
          <div className="dim">Tilak Maharashtra Vidyapeeth</div>
        </div>
        <div className="meta">2022</div>
      </div>
      <div className="exp-head" style={{ marginTop: 14 }}>
        <div>
          <div className="role">Bachelor of Computer Application</div>
          <div className="dim">Tilak Maharashtra Vidyapeeth</div>
        </div>
        <div className="meta">2020</div>
      </div>
    </Panel>
  );
}
