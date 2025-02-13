const TrendingLoader = () => {
    return (
        <div className="trending">
            <ul>
                {Array.from({ length: 5 }).map((_, index) => (
                    <li key={index}>
                        <p>{index + 1}</p>
                        <div className="w-[127px] h-[163px] rounded-lg bg-gray-300 animate-pulse"></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrendingLoader;
