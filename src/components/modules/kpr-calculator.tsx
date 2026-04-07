"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronDown, ChevronUp, Info } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { KPRResult } from "@/types";

function calculateKPR(
  price: number,
  downPaymentPct: number,
  tenorYears: number,
  interestRatePct: number
): KPRResult {
  const downPayment = price * (downPaymentPct / 100);
  const loanAmount = price - downPayment;
  const monthlyRate = interestRatePct / 100 / 12;
  const totalMonths = tenorYears * 12;

  let monthlyInstallment = 0;
  if (monthlyRate === 0) {
    monthlyInstallment = loanAmount / totalMonths;
  } else {
    monthlyInstallment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalPayment = monthlyInstallment * totalMonths + downPayment;
  const totalInterest = totalPayment - price;

  return { downPayment, loanAmount, monthlyInstallment, totalPayment, totalInterest };
}

interface KPRCalculatorProps {
  propertyPrice?: number;
  defaultOpen?: boolean;
}

export function KPRCalculator({ propertyPrice = 5_000_000_000, defaultOpen = false }: KPRCalculatorProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [price, setPrice] = useState(propertyPrice);
  const [dpPct, setDpPct] = useState(20);
  const [tenor, setTenor] = useState(15);
  const [rate, setRate] = useState(10.5);

  const result = calculateKPR(price, dpPct, tenor, rate);

  return (
    <div className="bg-white rounded-2xl border border-[#e1e3e4] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#f8f9fa] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Calculator size={18} className="text-emerald-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-[#191c1d]">KPR / Cicilan Calculator</p>
            {!open && (
              <p className="text-xs text-[#476083] font-label">
                Est. {formatPrice(result.monthlyInstallment)}/bulan
              </p>
            )}
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-[#74777f]" /> : <ChevronDown size={18} className="text-[#74777f]" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-5 border-t border-[#f3f4f5] pt-5">
              {/* Harga Properti */}
              <SliderInput
                label="Harga Properti"
                value={price}
                min={500_000_000}
                max={100_000_000_000}
                step={500_000_000}
                displayFn={(v) => formatPrice(v)}
                onChange={setPrice}
              />

              {/* Uang Muka */}
              <SliderInput
                label={`Uang Muka (${dpPct}%)`}
                value={dpPct}
                min={10}
                max={50}
                step={5}
                displayFn={(v) => `${v}% = ${formatPrice(price * v / 100)}`}
                onChange={setDpPct}
              />

              {/* Tenor */}
              <SliderInput
                label={`Tenor Kredit`}
                value={tenor}
                min={5}
                max={30}
                step={5}
                displayFn={(v) => `${v} tahun (${v * 12} bulan)`}
                onChange={setTenor}
              />

              {/* Suku Bunga */}
              <SliderInput
                label="Suku Bunga / Tahun"
                value={rate}
                min={7}
                max={15}
                step={0.5}
                displayFn={(v) => `${v}% per tahun`}
                onChange={setRate}
              />

              {/* Result Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <ResultCard
                  label="Cicilan / Bulan"
                  value={formatPrice(result.monthlyInstallment)}
                  highlight
                />
                <ResultCard label="Uang Muka" value={formatPrice(result.downPayment)} />
                <ResultCard label="Jumlah Kredit" value={formatPrice(result.loanAmount)} />
                <ResultCard label="Total Bunga" value={formatPrice(result.totalInterest)} warn />
              </div>

              {/* Total payment */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] rounded-xl">
                <p className="text-xs font-bold text-[#476083] font-label">Total Pembayaran</p>
                <p className="text-sm font-black text-[#000802]">{formatPrice(result.totalPayment)}</p>
              </div>

              <div className="flex items-start gap-2 text-xs text-[#74777f] font-label">
                <Info size={12} className="text-[#c4c6cf] shrink-0 mt-0.5" />
                <p>Simulasi bersifat estimasi. Hubungi bank untuk informasi KPR yang akurat.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SliderInput({
  label, value, min, max, step, displayFn, onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayFn: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-[#476083] font-label uppercase tracking-wider">{label}</label>
        <span className="text-xs font-bold text-[#191c1d] font-label">{displayFn(value)}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1.5 bg-[#e1e3e4] rounded-full" />
        <div
          className="absolute h-1.5 bg-emerald-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-5 z-10"
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-emerald-500 shadow-sm pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}

function ResultCard({ label, value, highlight, warn }: {
  label: string; value: string; highlight?: boolean; warn?: boolean;
}) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? "bg-emerald-50 border border-emerald-100" : warn ? "bg-amber-50 border border-amber-100" : "bg-[#f8f9fa] border border-[#e1e3e4]"}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider font-label text-[#476083] mb-1">{label}</p>
      <p className={`text-sm font-black ${highlight ? "text-emerald-700" : warn ? "text-amber-700" : "text-[#191c1d]"}`}>
        {value}
      </p>
    </div>
  );
}
