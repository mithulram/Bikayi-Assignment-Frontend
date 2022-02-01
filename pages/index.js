import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Table,Select, Row, Col  } from "antd";
import styles from '../styles/Home.module.css'
import "antd/dist/antd.css";

const { Option } = Select;

const axios = require("axios")

const Home = () => {
  const [prizes, setPrizes] = useState([]);
  const [winners, setWinners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [nobelPrizes, setNobelPrizes] = useState({});

  useEffect(async () => {
    if (!prizes.length) {
      const data = await axios.get("http://api.nobelprize.org/v1/prize.json")
      setPrizes(data?.data?.prizes)
    }
  }, [prizes])

  useEffect(async () => {
    if (prizes.length && !winners.length) {
      var winnerData = []
      var categoryList = []
      var nobelList = []
      for (let i in prizes) {
        var prize = prizes[i]
        var laureates = prize.laureates
        if (!categoryList.includes(prize.category)) {
          categoryList.push(prize.category)
        }
        for (let j in laureates) {
          var person = laureates[j]
          if (person && person.id) {
            if (person.share == "4") {
              nobelList.push({
                category: prize.category,
                year: prize.year,
                id: person.id,
                firstName: person.firstname,
                surname: person.surname,
                motivation: person.motivation,
                share: person.share
              })
            }

            winnerData.push({
              category: prize.category,
              year: prize.year,
              id: person.id,
              firstName: person.firstname,
              surname: person.surname,
              motivation: person.motivation,
              share: person.share
            })
          }
        }
      }

      setWinners(winnerData)
      setNobelPrizes(nobelList)
      setCategories(categoryList)
    }
  }, [prizes, winners])

  useEffect(() => {
    if (!dates.length) {
      var dateList = []
      var existingDate = 1900
      while (existingDate <= 2018) {
        dateList.push(existingDate)
        existingDate += 1
      }
      setDates(dateList)
    }
  }, [dates])

  useEffect(() => {
    if (selectedCategories.length) {
      var winnerData = []
      for (let i in prizes) {
        var prize = prizes[i]
        var laureates = prize.laureates
        if (selectedCategories.includes(prize.category)) {
          for (let j in laureates) {
            var person = laureates[j]
            if (person && person.id) {
              winnerData.push({
                category: prize.category,
                year: prize.year,
                id: person.id,
                firstName: person.firstname,
                surname: person.surname,
                motivation: person.motivation,
                share: person.share
              })
            }
          }
        }
      }

      setWinners(winnerData)
    }
  }, [selectedCategories])

  useEffect(() => {
    if (selectedDates.length) {
      var winnerData = []
      for (let i in prizes) {
        var prize = prizes[i]
        var laureates = prize.laureates
        if (selectedDates.includes(parseInt(prize.year))) {
          for (let j in laureates) {
            var person = laureates[j]
            if (person && person.id) {
              winnerData.push({
                category: prize.category,
                year: prize.year,
                id: person.id,
                firstName: person.firstname,
                surname: person.surname,
                motivation: person.motivation,
                share: person.share
              })
            }
          }
        }
      }

      setWinners(winnerData)
    }
  }, [selectedDates])

  useEffect(() => {
    if (!selectedCategories.length && !selectedDates.length) {
      var winnerData = []
      var categoryList = []
      for (let i in prizes) {
        var prize = prizes[i]
        var laureates = prize.laureates
        if (!categoryList.includes(prize.category)) {
          categoryList.push(prize.category)
        }
        for (let j in laureates) {
          var person = laureates[j]
          if (person && person.id) {
            winnerData.push({
              category: prize.category,
              year: prize.year,
              id: person.id,
              firstName: person.firstname,
              surname: person.surname,
              motivation: person.motivation,
              share: person.share
            })
          }
        }
      }

      setWinners(winnerData)
      setCategories(categoryList)
    }
  }, [selectedCategories, selectedDates])

  useEffect(() => {

  })

  const handleChange = (value) => {
    setSelectedCategories(value)
  }

  const handleChangeDate = (value) => {
    setSelectedDates(value)
  }

  const columns = [
		{title: "Id",key: "id",dataIndex: "id"},
		{title: "First Name", render: (text, record) =>
			<div >{text.firstName}</div>
		},
		{title: "Surname", render: (text, record) =>
			<div >{text.surname}</div>
		},
		{title: "Category",key: "category",dataIndex: "category"},
		{title: "Year",key: "year",dataIndex: "year"},
		{title: "Motivation" , width: "30%", key: "motivation",dataIndex: "motivation"},
		{title: "Share",key: "share",dataIndex: "share"},
	];
  return (
    <div className={styles.container}>
      <Head>
        <title>Prize result</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Row gutter={48} style={{width: "100%", marginBottom: "40px"}}>
          <Col span={12}>
            <h3>Select Category</h3>
          </Col>
          <Col span={12}>
            <h3>Select Date</h3>
          </Col>
          <Col span={12}>
            <Select
              mode="multiple"
              style={{ width: '50%' }}
              placeholder="select categories"
              onChange={handleChange}
              value={selectedCategories}
            >
              {categories?.map(item => {
                return (
                  <Option value={item}>{item}</Option>
                )
              })}
            </Select>
          </Col>
          <Col span={12}>
            <Select
              mode="multiple"
              style={{ width: '50%' }}
              placeholder="select date"
              onChange={handleChangeDate}
              value={selectedDates}
            >
              {dates?.map(item => {
                return (
                  <Option value={item}>{item}</Option>
                )
              })}
            </Select>
          </Col>
        </Row>
        <h3>Winners List</h3>
        <Table 
          columns={columns} 
          dataSource={winners?.length ? winners : []} 
        />
        <h3 style={{marginTop: "20px"}}>Nobel Prize List - More than 1 times</h3>
        <Table 
          columns={columns} 
          dataSource={nobelPrizes?.length ? nobelPrizes.slice(0, 4) : []} 
        />
      </main>
    </div>
  )
}

export default Home;