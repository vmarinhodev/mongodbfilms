import { GetServerSideProps } from "next";
import clientPromise from "../lib/mongodb";

interface Movie {
    _id: string;
    title: string;
    metacritic: number;
    plot: string;
}

interface MoviesProps {
    movies: Movie[];
}

const Movies: React.FC<MoviesProps> = ({ movies }) => {
    return (
        <>
            <h1>Top 20 Movies pf all times</h1>
            <p>
                <small>(According to Metacritic)</small>
            </p>
            <ul>
                {movies.map((movie) => (
                    <li key={movie._id}>
                        <h2>{movie.title}</h2>
                        <h3>{movie.metacritic}</h3>
                        <p>{movie.plot}</p>
                    </li>
                ))}
            </ul>
        </>
    )
};

export default Movies;

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        // console.log("db", db)
        const movies = await db
            .collection("movies")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();
       return {
        props: { movies: JSON.parse(JSON.stringify(movies)) },
       };
    } catch (e) {
        console.error(e);
        return { props: { movies: [] } };
    }
}