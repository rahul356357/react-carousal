


import React, { useState, useLayoutEffect, useEffect } from 'react';
import styled from 'styled-components';
import productData from './data.json';


const Container = styled.div`
    margin: 15% 10%;
    display: flex;
    flex:4;
    align-items: center;
    overflow: hidden;
    position: relative;`

const LeftArrow = styled.span`
   &:before {
        content: '<';
        font-size: 2rem;
        cursor: pointer;
        position: absolute;
        left: 0;
        z-index:2
    }`;
const RightArrow = styled.span`
    &:before {
        content: '>';
        font-size: 2rem;
        cursor: pointer;
        position: absolute;
        right: 0;
    }`;

const ItemDesc = styled.div`
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const SliderImage = styled.div`
    transition : transform 1s;
    height: 400px;
    width:${props => props.dimensions && props.dimensions.width / 3};
    transform:${props => props.isMoving ? `translateX(${props.scrollWidth})` : ''};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    box-sizing:border-box;
`;

const Text = styled.span`
    font-size:${props => props.fontSize};
    color:${props => props.fontColor}
`
const Image = styled.img`
    height: ${props => props.shouldAnimate ? '80%' : '70%'};
    width: ${props => props.shouldAnimate ? '80%' : '70%'};
    position: absolute;
    transition: all 0.3s ease-in
`;

const Slider = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;`

const SelectContainer = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    display:flex;
    flex-direction:column;
    z-index:3
`


const Item = ({ reset, currentIndex, index, dimensions, direction, productName, productCategory, productPrice, productImage, products, setReseFalse }) => {
    const [isMoving, handleMoving] = useState();
    const [currentImageIndex, handleImageIndex] = useState(0);
    const [scrollWidth, handleScrollWidth] = useState();
    const [imageDirection, handleImageDirection] = useState();

    useEffect(() => {
        handleImageIndex(index)
    }, [index, currentIndex]);

    useEffect(() => {
        if (direction) {
            handleMoving(true);
            handleImageDirection(direction)
        }
    }, [direction]);

    useEffect(() => {
        if (reset) {
            handleScrollWidth(0)
            setReseFalse()
        }
    }, [reset])

    useEffect(() => {
        if (direction == 'right') {
            if (currentIndex > 0 && currentIndex <= products.length - 2) {
                handleScrollWidth(-(dimensions.width / 3) * (currentIndex - 1))
            }
        }
    }, [currentIndex]);
    return (<SliderImage dimensions={dimensions} isMoving={isMoving} scrollWidth={imageDirection && `${scrollWidth}px`}>
        <Image src={productImage} shouldAnimate={currentImageIndex == currentIndex} alt={productImage} />
        <ItemDesc>
            <div>
                <Text fontSize={16} fontColor={'black'} >{productName}</Text>
                <Text fontSize={12} fontColor={'grey'} > {productCategory} </Text>
            </div>
            <div>
                <Text fontSize={12} fontColor={'green'} >₹{productPrice}</Text>
            </div>
        </ItemDesc>
    </SliderImage>)
}


export default () => {
    const [selectedCategory, handleSelectedCategory] = useState()
    const [products, handleProducts] = useState(productData);
    const [categories, handleCategories] = useState([]);
    useEffect(() => {
        let categories = Array.from(new Set([...productData.map(r => r.productCategory)]))
        handleCategories(categories)
    }, [])
    const handleSelect = (e) => {
        const filteredProducts = [...productData.filter(pr => pr.productCategory == e.target.value)];
        handleProducts(filteredProducts)
        handleSelectedCategory(e.target.value)
    }
    return <SliderComponent  selectedCategory={selectedCategory} products={products} categories={categories} handleSelect={handleSelect} handleProductsReset={() => handleProducts(productData)} />
}

const SliderComponent = ({ products, categories, selectedCategory, handleSelect, handleProductsReset }) => {
    const [currentIndex, handleCurrentIndex] = useState(0);
    const [direction, handleDirection] = useState();
    const [carousalContainetDimensions, handleCarousalContainerDimensions] = useState({});
    const [reset, handleReset] = useState(false);
    const carousalRef = React.createRef();
    const handlePreviousImage = () => {
        handleCurrentIndex(currentIndex - 1);
    }
    const handleNextImage = () => {
        handleCurrentIndex(currentIndex + 1);
        handleDirection('right');
    }
    useEffect(() => {
        handleReset(true)
        handleCurrentIndex(0)
    }, [products])
    useLayoutEffect(() => {
        if (carousalRef.current) {
            let clientDimensions = carousalRef.current.getBoundingClientRect();
            handleCarousalContainerDimensions(clientDimensions);
        }
    }, [])
    return (
        <div>
            <Container ref={carousalRef}>
                <SelectContainer>
                    <Text fontSize={12} fontColor={'black'}> Filter By Category </Text>
                    <select value={selectedCategory} onChange={handleSelect}>
                        <option readOnly></option>
                        { categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={handleProductsReset} >
                        Reset
                    </button>
                </SelectContainer>
                {currentIndex !== 0 &&
                    <LeftArrow onClick={handlePreviousImage} />}
                <Slider>
                    {products.map((data, index) => <Item reset={reset} setReseFalse={() => handleReset(false)}  {...data} direction={direction} products={products} dimensions={carousalContainetDimensions} key={`${index.toString()}`} index={index} currentIndex={currentIndex} /> )}
                </Slider>
                {(currentIndex !== products.length - 1) && <RightArrow onClick={handleNextImage} />}
            </Container>
        </div>
    )
}
