<?php
// ================= DATABASE CONNECTION =================
$servername = "veritas-db-main.mysql.database.azure.com";
$username   = "softdev";
$password   = "$<softdev>1";
$dbname     = "dbipfkhop9oqna";
$port       = 3306;
$ssl_ca     = "/home/site/wwwroot/ssl/DigiCertGlobalRootG2.crt.pem";

$dsn = "mysql:host=$servername;port=$port;dbname=$dbname;charset=utf8mb4";

$options = [
    PDO::MYSQL_ATTR_SSL_CA => $ssl_ca,
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $conn = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// ================= FETCH DATA =================
$sql = "
    SELECT
        er.matric_no,
        CONCAT_WS(' ', st.lname, st.fname, st.mname) AS student_name,
        er.student_accommodation,
        er.updated_at
    FROM exeat_requests er
    JOIN students st ON st.id = er.student_id
    WHERE
        er.status = 'completed'
        AND er.updated_at >= '2026-01-01'
        AND er.updated_at < '2027-01-01'
    ORDER BY er.updated_at DESC
";
$stmt = $conn->prepare($sql);
$stmt->execute();
$rows = $stmt->fetchAll();

// ================= STATISTICS =================
$today = date('Y-m-d');
$yesterday = date('Y-m-d', strtotime('-1 day'));
$thisMonthStart = date('Y-m-01');
$thisMonthEnd = date('Y-m-t');

$statsSql = "
    SELECT
        COUNT(*) AS total_2026,
        SUM(updated_at >= :today AND updated_at < DATE_ADD(:today, INTERVAL 1 DAY)) AS today_count,
        SUM(updated_at >= :yesterday AND updated_at < :today) AS yesterday_count,
        SUM(updated_at >= :month_start AND updated_at < DATE_ADD(:month_end, INTERVAL 1 DAY)) AS month_count
    FROM exeat_requests
    WHERE status = 'completed'
      AND updated_at >= '2026-01-01'
      AND updated_at < '2027-01-01'
";
$statsStmt = $conn->prepare($statsSql);
$statsStmt->execute([
    ':today' => $today,
    ':yesterday' => $yesterday,
    ':month_start' => $thisMonthStart,
    ':month_end' => $thisMonthEnd,
]);
$stats = $statsStmt->fetch();

// ================= CSV DOWNLOAD =================
if (isset($_GET['download']) && $_GET['download'] === 'csv') {
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="completed_exeat_2026.csv"');

    $output = fopen('php://output', 'w');
    fputcsv($output, ['Matric No', 'Student Name', 'Accommodation', 'Updated At']);

    foreach ($rows as $row) {
        fputcsv($output, [
            $row['matric_no'],
            $row['student_name'],
            $row['student_accommodation'],
            $row['updated_at'],
        ]);
    }

    fclose($output);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Completed Exeat Requests (2026)</title>

<!-- Google Font -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- DataTables CSS -->
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">

<style>
:root {
    --primary: #0d6efd;
    --bg: #f4f6fb;
    --card: #ffffff;
    --text: #1f2937;
    --muted: #6b7280;
}

* { box-sizing: border-box; }
body { margin:0; font-family:'Inter',sans-serif; background:var(--bg); color:var(--text); }

/* ===== PAGE LAYOUT ===== */
.wrapper { max-width:1200px; margin:40px auto; padding:0 20px; }
.header { display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; }
.header h1 { font-size:24px; font-weight:700; }
.header span { color:var(--muted); font-size:14px; }

/* ===== STATS ===== */
.stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:25px; }
.stat-card { position:relative; overflow:hidden; background:var(--card); border-radius:12px; padding:20px; box-shadow:0 6px 18px rgba(0,0,0,0.06); }
.stat-card::after { content:''; position:absolute; top:-20px; right:-20px; width:80px; height:80px; background:rgba(13,110,253,0.08); border-radius:50%; }
.stat-title { font-size:13px; color:var(--muted); margin-bottom:8px; }
.stat-value { font-size:28px; font-weight:700; color:var(--primary); }

/* ===== CARD ===== */
.card { background: var(--card); border-radius: 12px; padding: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.06); }
.btn { background: var(--primary); color:#fff; padding:10px 16px; border-radius:8px; font-weight:600; text-decoration:none; transition:0.2s; }
.btn:hover { background:#084298; }

/* ===== TABLE ===== */
table.dataTable { border-collapse: collapse !important; }
table.dataTable thead th { background:#f1f5f9; font-weight:600; border-bottom:none; }
table.dataTable tbody tr { transition: background 0.2s; }
table.dataTable tbody tr:hover { background:#f9fafb; }

.footer-note { margin-top:15px; font-size:13px; color:var(--muted); }

/* ===== MOBILE ===== */
@media (max-width:768px) {
    .header { flex-direction:column; align-items:flex-start; gap:10px; }
}
</style>
</head>
<body>

<div class="wrapper">

    <!-- HEADER -->
    <div class="header">
        <div>
            <h1>Completed Exeat Requests</h1>
            <span>Academic Year 2026 • Approved & Completed</span>
        </div>
        <a href="?download=csv" class="btn">⬇ Export CSV</a>
    </div>

    <!-- STATISTICS -->
    <div class="stats">
        <div class="stat-card">
            <div class="stat-title">Total Completed (2026)</div>
            <div class="stat-value"><?= number_format($stats['total_2026']) ?></div>
        </div>
        <div class="stat-card">
            <div class="stat-title">Completed Today</div>
            <div class="stat-value"><?= number_format($stats['today_count']) ?></div>
        </div>
        <div class="stat-card">
            <div class="stat-title">Completed Yesterday</div>
            <div class="stat-value"><?= number_format($stats['yesterday_count']) ?></div>
        </div>
        <div class="stat-card">
            <div class="stat-title">Completed This Month</div>
            <div class="stat-value"><?= number_format($stats['month_count']) ?></div>
        </div>
    </div>

    <!-- TABLE CARD -->
    <div class="card">
        <table id="exeatTable" class="display">
            <thead>
                <tr>
                    <th>Matric No</th>
                    <th>Student Name</th>
                    <th>Accommodation</th>
                    <th>Updated At</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($rows as $row): ?>
                <tr>
                    <td><?= htmlspecialchars($row['matric_no']) ?></td>
                    <td><?= htmlspecialchars($row['student_name']) ?></td>
                    <td><?= htmlspecialchars($row['student_accommodation']) ?></td>
                    <td><?= date('d M Y, H:i', strtotime($row['updated_at'])) ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <div class="footer-note">
            Showing all completed exeat requests for the year 2026.
        </div>
    </div>

</div>

<!-- JS -->
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script>
$(document).ready(function () {
    $('#exeatTable').DataTable({
        pageLength: 25,
        order: [[3, 'desc']],
        language: {
            search: "Search records:",
            lengthMenu: "Show _MENU_ entries"
        }
    });
});
</script>

</body>
</html>
