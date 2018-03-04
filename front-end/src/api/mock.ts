export const mockTrip = {
    Trip: [
      {
        Leg: [
          {
            name: 'Spårvagn 5',
            sname: '5',
            type: 'TRAM',
            id: '9015014500500062',
            direction: 'Östra Sjukhuset',
            fgColor: '#eb1923',
            bgColor: '#ffffff',
            stroke: 'Solid',
            accessibility: 'wheelChair',
            Origin: {
              name: 'Vågmästareplatsen, Göteborg',
              type: 'ST',
              id: '9022014007520001',
              routeIdx: '12',
              time: '09:27',
              date: '2017-10-24',
              track: 'A',
              rtTime: '09:28',
              rtDate: '2017-10-24',
              $: '\n'
            },
            Destination: {
              name: 'Brunnsparken, Göteborg',
              type: 'ST',
              id: '9022014001760001',
              routeIdx: '16',
              time: '09:33',
              date: '2017-10-24',
              track: 'A',
              rtTime: '09:35',
              rtDate: '2017-10-24',
              $: '\n'
            },
            JourneyDetailRef: {
              ref: '#'
            }
          },
          {
            name: 'Gå',
            type: 'WALK',
            Origin: {
              name: 'Brunnsparken, Göteborg',
              type: 'ST',
              id: '9022014001760001',
              time: '09:38',
              date: '2017-10-24',
              track: 'A',
              $: '\n'
            },
            Destination: {
              name: 'Brunnsparken, Göteborg',
              type: 'ST',
              id: '9022014001760003',
              time: '09:38',
              date: '2017-10-24',
              track: 'C',
              $: '\n'
            }
          },
          {
            name: 'Spårvagn 9',
            sname: '9',
            type: 'TRAM',
            id: '9015014500900058',
            direction: 'Kungssten',
            fgColor: '#b9e2f8',
            bgColor: '#00394d',
            stroke: 'Solid',
            accessibility: 'wheelChair',
            Origin: {
              name: 'Brunnsparken, Göteborg',
              type: 'ST',
              id: '9022014001760003',
              routeIdx: '6',
              time: '09:41',
              date: '2017-10-24',
              track: 'C',
              rtTime: '09:40',
              rtDate: '2017-10-24',
              Notes: {
                Note: [
                  {
                    key: 'disruption-message',
                    severity: 'normal',
                    priority: '1',
                    $: 'Linje 60, extrabuss, ' +
                        'förstärker från Redbergsplatsen ' +
                        '23-27 oktober klockan 14:59 och 16:15 ' +
                        'via samtliga mellanliggande hållplatser till Järntorget på grund av många resande.'
                  },
                  {
                    key: 'disruption-message',
                    severity: 'normal',
                    priority: '2',
                    $: 'Linje 16, Brunnsparken mot Högsbohöjd, avgår från läge E.'
                  }
                ]
              }
            },
            Destination: {
              name: 'Masthuggstorget, Göteborg',
              type: 'ST',
              id: '9022014004780002',
              routeIdx: '9',
              time: '09:47',
              date: '2017-10-24',
              track: 'B',
              rtTime: '09:47',
              rtDate: '2017-10-24',
              $: '\n'
            },
            JourneyDetailRef: {
              ref: '#'
            }
          }
        ]
      },
      {
        valid: 'false',
        Leg: [
          {
            name: 'Spårvagn 6',
            sname: '6',
            type: 'TRAM',
            id: '9015014500600065',
            direction: 'Kortedala via Sahlgrenska',
            fgColor: '#fa8719',
            bgColor: '#00394d',
            stroke: 'Solid',
            cancelled: 'true',
            accessibility: 'wheelChair',
            Origin: {
              name: 'Vågmästareplatsen, Göteborg',
              type: 'ST',
              id: '9022014007520001',
              routeIdx: '12',
              time: '09:31',
              date: '2017-10-24',
              track: 'A',
              rtTime: '09:29',
              rtDate: '2017-10-24',
              $: '\n'
            },
            Destination: {
              name: 'Järntorget, Göteborg',
              type: 'ST',
              id: '9022014003640004',
              routeIdx: '20',
              time: '09:45',
              date: '2017-10-24',
              track: 'D',
              rtTime: '09:43',
              rtDate: '2017-10-24',
              $: '\n'
            },
            JourneyDetailRef: {
              ref: '#'
            }
          },
          {
            name: 'Gå',
            type: 'WALK',
            Origin: {
              name: 'Järntorget, Göteborg',
              type: 'ST',
              id: '9022014003640004',
              time: '09:50',
              date: '2017-10-24',
              track: 'D',
              $: '\n'
            },
            Destination: {
              name: 'Järntorget, Göteborg',
              type: 'ST',
              id: '9022014003640001',
              time: '09:50',
              date: '2017-10-24',
              track: 'A',
              $: '\n'
            }
          },
          {
            name: 'Spårvagn 3',
            sname: '3',
            type: 'TRAM',
            id: '9015014500300058',
            reachable: 'false',
            direction: 'Marklandsgatan',
            fgColor: '#004b85',
            bgColor: '#ffffff',
            stroke: 'Solid',
            Origin: {
              name: 'Järntorget, Göteborg',
              type: 'ST',
              id: '9022014003640001',
              routeIdx: '16',
              time: '09:50',
              date: '2017-10-24',
              track: 'A',
              rtTime: '09:50',
              rtDate: '2017-10-24',
              $: '\n'
            },
            Destination: {
              name: 'Masthuggstorget, Göteborg',
              type: 'ST',
              id: '9022014004780002',
              routeIdx: '17',
              time: '09:51',
              date: '2017-10-24',
              track: 'B',
              rtTime: '09:51',
              rtDate: '2017-10-24',
              $: '\n'
            },
            JourneyDetailRef: {
              ref:'#'
            }
          }
        ]
      }
    ]
  };
      