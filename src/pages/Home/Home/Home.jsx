import React from 'react';
import Banner from '../Banner/Banner';
import PopularCamps from '../PopularCamps/PopularCamps';
import FeedbackSection from '../FeedbackSection/FeedbackSection';
import StatsSection from '../StatsSection/StatsSection';


const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <PopularCamps></PopularCamps>
            <FeedbackSection></FeedbackSection>
            <StatsSection></StatsSection>
        </div>
    );
};

export default Home;