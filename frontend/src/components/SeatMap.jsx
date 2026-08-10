const STATUS_STYLE = {
  AVAILABLE: { background: 'var(--seat-available)', color: 'var(--text-secondary)', cursor: 'pointer', border: '1px solid var(--border-strong)' },
  BOOKED: { background: 'var(--seat-booked)', color: 'var(--text-muted)', cursor: 'not-allowed', opacity: 0.5, border: '1px solid var(--border-subtle)' },
  LOCKED: { background: 'var(--seat-booked)', color: 'var(--text-muted)', cursor: 'not-allowed', opacity: 0.5, border: '1px solid var(--border-subtle)' },
};

export default function SeatMap({ seats, selected, onToggle }) {
  const rows = groupByRow(seats);

  return (
    <div>
      <div style={styles.screen}>SCREEN</div>

      <div style={styles.rows}>
        {Object.entries(rows).map(([rowNum, rowSeats]) => (
          <div key={rowNum} style={styles.row}>
            <span style={styles.rowLabel}>{rowSeats[0]?.seatLabel?.[0]}</span>
            <div style={styles.seatsInRow}>
              {rowSeats.map((seat) => {
                const isSelected = selected.includes(seat.seatLabel);
                const isDisabled = seat.status !== 'AVAILABLE' && !isSelected;
                const style = isSelected
                  ? { background: 'var(--seat-selected)', color: '#fff', cursor: 'pointer', border: '1px solid var(--accent-hover)', boxShadow: '0 0 0 2px var(--accent-soft)' }
                  : STATUS_STYLE[seat.status] || STATUS_STYLE.AVAILABLE;

                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => onToggle(seat)}
                    style={{ ...styles.seat, ...style }}
                    title={seat.seatLabel}
                  >
                    {seat.columnNumber}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.legend}>
        <LegendItem colorVar="var(--seat-available)" label="Available" />
        <LegendItem colorVar="var(--seat-selected)" label="Selected" />
        <LegendItem colorVar="var(--seat-booked)" label="Booked / Locked" faded />
      </div>
    </div>
  );
}

function LegendItem({ colorVar, label, faded }) {
  return (
    <div style={styles.legendItem}>
      <span style={{ ...styles.legendSwatch, background: colorVar, opacity: faded ? 0.5 : 1 }} />
      <span style={styles.legendLabel}>{label}</span>
    </div>
  );
}

function groupByRow(seats) {
  return seats.reduce((acc, seat) => {
    const key = seat.rowNumber;
    if (!acc[key]) acc[key] = [];
    acc[key].push(seat);
    return acc;
  }, {});
}

const styles = {
  screen: {
    margin: '0 auto 32px',
    width: '80%',
    maxWidth: 480,
    height: 8,
    background: 'linear-gradient(90deg, transparent, var(--border-strong), transparent)',
    borderRadius: '50%',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.7rem',
    letterSpacing: '0.3em',
    position: 'relative',
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    width: 18,
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 700,
    textAlign: 'center',
  },
  seatsInRow: {
    display: 'flex',
    gap: 6,
  },
  seat: {
    width: 28,
    height: 28,
    borderRadius: 6,
    fontSize: '0.68rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.12s ease',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    marginTop: 32,
  },
  legendItem: { display: 'flex', alignItems: 'center', gap: 8 },
  legendSwatch: { width: 16, height: 16, borderRadius: 4 },
  legendLabel: { fontSize: '0.8rem', color: 'var(--text-secondary)' },
};
