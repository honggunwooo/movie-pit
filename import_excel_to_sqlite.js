const sqlite3 = require('sqlite3').verbose();
const xlsx = require('xlsx');

// 엑셀 파일 불러오기
const workbook = xlsx.readFile('movies.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const movies = xlsx.utils.sheet_to_json(sheet);

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('movies.db');

db.serialize(() => {
    // 테이블 생성
    db.run(`CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY,
        title TEXT,
        original_title TEXT,
        overview TEXT,
        release_date TEXT,
        poster_path TEXT,
        backdrop_path TEXT,
        popularity REAL,
        vote_average REAL,
        vote_count INTEGER
    )`);

    // 데이터 삽입
    const stmt = db.prepare(`INSERT INTO movies 
        (id, title, original_title, overview, release_date, poster_path, backdrop_path, popularity, vote_average, vote_count) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    movies.forEach(movie => {
        stmt.run(
            movie.ID, 
            movie.Title, 
            movie['Original Title'], 
            movie.Overview, 
            movie['Release Date'], 
            movie['Poster Path'], 
            movie['Backdrop Path'], 
            movie.Popularity, 
            movie['Vote Average'], 
            movie['Vote Count']
        );
    });

    stmt.finalize();
    console.log("엑셀 데이터를 SQLite에 성공적으로 삽입했습니다.");
});

db.close();
