import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  useTheme
} from '@material-ui/core';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import HomeIcon from '@material-ui/icons/Home';

const TrafficByDevice = (props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [11, 15, 23, 63],
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
          colors.orange[600],
          colors.green[600]
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: ['Energy', 'Groceries', 'Leisure', 'Mortgage']
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [
    {
      title: 'Energy',
      value: 11,
      icon: WbIncandescentIcon,
      color: colors.indigo[500]
    },
    {
      title: 'Groceries',
      value: 15,
      icon: LocalGroceryStoreIcon,
      color: colors.red[600]
    },
    {
      title: 'Leisure',
      value: 12,
      icon: SportsEsportsIcon,
      color: colors.orange[600]
    },
    {
      title: 'Mortgage',
      value: 63,
      icon: HomeIcon,
      color: colors.green[600]
    }
  ];

  return (
    <Card {...props}>
      <CardHeader title="Expense Types" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          {devices.map(({
            color,
            icon: Icon,
            title,
            value
          }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
              <Icon color="action" />
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h2"
              >
                {value}
                %
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrafficByDevice;
