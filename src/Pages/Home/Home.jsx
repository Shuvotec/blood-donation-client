import React from 'react';
import Banner from './Banner/Banner';
import FeaturedSection from './Featuredsection/Featuredsection';
import Featuredsectiont from './Featuredsection/Featuredsectiont';
import ContactForm from './Featuredsection/ContactForm/ContactForm';



const Home = () => {
    return (
        <div>
           <Banner></Banner>
           <FeaturedSection></FeaturedSection>
           <Featuredsectiont></Featuredsectiont>
           <ContactForm></ContactForm>
        </div>
    );
};

export default Home;