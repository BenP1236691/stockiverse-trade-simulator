
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart2, 
  Users, 
  Clock, 
  ArrowRight, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import StockCard from '@/components/StockCard';
import { simulationEngine } from '@/utils/simulationEngine';
import { StockWithHistory } from '@/utils/types';

// We need framer-motion for advanced animations
const Index: React.FC = () => {
  const isMobile = useIsMobile();
  const [trendingStocks, setTrendingStocks] = useState<StockWithHistory[]>([]);
  
  // Initialize and get some trending stocks
  useEffect(() => {
    // Start simulation engine
    simulationEngine.start();
    
    // Get some stocks and sort by change percentage
    const stocks = simulationEngine.getStocks();
    const trending = [...stocks]
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 3);
    
    setTrendingStocks(trending);
    
    // Subscribe to updates
    const unsubscribe = simulationEngine.subscribe((updatedStocks) => {
      const newTrending = [...updatedStocks]
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 3);
      
      setTrendingStocks(newTrending);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background pointer-events-none" />
        
        {/* Navigation */}
        <header className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">ST</span>
            </div>
            <span className="font-semibold text-lg">Stockiverse</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/portfolio" className="text-sm font-medium hover:text-primary transition-colors">
              Portfolio
            </Link>
            <Link to="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">
              Leaderboard
            </Link>
            <Button asChild>
              <Link to="/dashboard">Start Trading</Link>
            </Button>
          </div>
          
          <Button asChild variant="secondary" className="md:hidden">
            <Link to="/dashboard">
              <TrendingUp size={16} className="mr-2" />
              Trade
            </Link>
          </Button>
        </header>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="mb-6">
                <Clock size={12} className="mr-1" />
                Live Trading Simulation
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            >
              Master Stock Trading <span className="text-primary">Without Risk</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Practice trading with virtual $100,000 on our realistic stock market simulator. 
              Compete with others and learn investment strategies in real-time.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8">
                <Link to="/dashboard">
                  Start Trading Now
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12">
                <Link to="/leaderboard">View Leaderboard</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating graphics */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
              Key Features
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to practice trading in a realistic environment
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInVariants}
              className="glass-panel p-8"
            >
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Market Simulation</h3>
              <p className="text-muted-foreground mb-4">
                Stock prices change every 5 seconds based on realistic market algorithms,
                creating a dynamic trading environment.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-primary mr-2" />
                  Over 120 companies to trade
                </li>
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-primary mr-2" />
                  Real-time price charts
                </li>
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-primary mr-2" />
                  Market trends and indicators
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInVariants}
              className="glass-panel p-8"
            >
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Portfolio Management</h3>
              <p className="text-muted-foreground mb-4">
                Track your investments, analyze performance, and make data-driven
                decisions to maximize returns.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-primary mr-2" />
                  $100,000 starting capital
                </li>
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-primary mr-2" />
                  Performance metrics and analysis
                </li>
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-primary mr-2" />
                  Trade history and reporting
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInVariants}
              className="glass-panel p-8"
            >
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multiplayer Competition</h3>
              <p className="text-muted-foreground mb-4">
                Compete with other traders on the leaderboard and see how your
                investment strategies stack up.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-primary mr-2" />
                  Global leaderboard
                </li>
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-primary mr-2" />
                  Performance ranking
                </li>
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-primary mr-2" />
                  Customizable trader profile
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Trending Stocks Section */}
      {trendingStocks.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="text-center mb-12"
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4">
                Trending Stocks
              </motion.h2>
              <motion.p variants={itemVariants} className="text-muted-foreground max-w-2xl mx-auto">
                These stocks are experiencing the most movement right now
              </motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingStocks.map((stock, index) => (
                <motion.div
                  key={stock.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.4,
                    type: 'spring',
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  <StockCard stock={stock} />
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button asChild variant="outline">
                <Link to="/dashboard">
                  View All Stocks
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
      
      {/* Call to Action */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Trading Journey?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-8">
              Join thousands of traders learning the market with our risk-free simulation.
              Start with $100,000 in virtual cash and build your portfolio today.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button asChild size="lg" className="h-12 px-10">
                <Link to="/dashboard">
                  Start Trading Now
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">ST</span>
              </div>
              <span className="font-semibold">Stockiverse</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Portfolio
              </Link>
              <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Leaderboard
              </Link>
              <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Stockiverse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
